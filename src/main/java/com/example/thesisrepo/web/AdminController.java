package com.example.thesisrepo.web;

import com.example.thesisrepo.profile.LecturerProfile;
import com.example.thesisrepo.profile.LecturerProfileRepository;
import com.example.thesisrepo.profile.StudentProfile;
import com.example.thesisrepo.profile.StudentProfileRepository;
import com.example.thesisrepo.service.CurrentUserService;
import com.example.thesisrepo.thesis.*;
import com.example.thesisrepo.user.Role;
import com.example.thesisrepo.user.User;
import com.example.thesisrepo.user.UserRepository;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

  private final ThesisRepository theses;
  private final ThesisChecklistRepository tchecks;
  private final ChecklistItemRepository items;
  private final ApprovalRepository approvals;
  private final CurrentUserService current;

  // ➕ new dependencies for student and lecturer lookup
  private final UserRepository users;
  private final StudentProfileRepository studentProfiles;
  private final LecturerProfileRepository lecturerProfiles;

  /** List theses (optionally by status) */
  @GetMapping("/theses")
  @PreAuthorize("hasRole('ADMIN')")
  public List<Thesis> byStatus(@RequestParam(required = false) String status) {
    if (status == null || status.isBlank()) {
      return theses.findAll();
    }
    var s = Thesis.ThesisStatus.valueOf(status.toUpperCase());
    return theses.findByCurrentStatus(s);
  }

  /** Get currently checked keys for a thesis (so UI can pre-fill) */
  @GetMapping("/theses/{id}/checklist")
  @PreAuthorize("hasRole('ADMIN')")
  public Map<String, Object> getChecklist(@PathVariable Long id) {
    var thesis = theses.findById(id).orElseThrow();
    var checked = tchecks.findByThesisId(thesis.getId()).stream()
      .filter(ThesisChecklist::isChecked)
      .map(tc -> tc.getItem().getKey())
      .collect(Collectors.toSet());

    return Map.of("thesisId", id, "checked", checked);
  }

  /**
   * Save checklist ticks.
   * Accepts either:
   *  - { "keys": ["k1","k2",...], "replace": true/false }
   *  - {
   *        "selections": [
   *          {"key":"k1","label":"Title","category":"Title Page"},
   *          ...
   *        ],
   *        "replace": true/false
   *    }
   * If 'replace' = true, anything not in payload will be unchecked.
   * Unknown keys in 'selections' are auto-created as ChecklistItem.
   */
  @PostMapping("/theses/{id}/checklist")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> saveChecklist(
      @PathVariable Long id,
      @RequestBody ChecklistPayload req
  ) {
    var me = current.requireCurrentUser();
    var thesis = theses.findById(id).orElse(null);
    if (thesis == null) {
      return ResponseEntity.notFound().build();
    }

    // Collect all keys we want to end up checked
    Set<String> incomingKeys = new LinkedHashSet<>();

    if (req.selections != null && !req.selections.isEmpty()) {
      for (ChecklistSelection s : req.selections) {
        if (s.key == null || s.key.isBlank()) continue;

        ChecklistItem item = items.findByKey(s.key).orElseGet(() -> {
          ChecklistItem ci = new ChecklistItem();
          ci.setKey(s.key);
          ci.setLabel(s.label != null ? s.label : s.key);
          ci.setCategory(s.category);
          return items.save(ci);
        });

        incomingKeys.add(item.getKey());
      }
    } else if (req.keys != null) {
      incomingKeys.addAll(req.keys);
    }

    // Existing checks for this thesis, keyed by checklist key
    Map<String, ThesisChecklist> existing = tchecks.findByThesisId(thesis.getId())
      .stream()
      .collect(Collectors.toMap(tc -> tc.getItem().getKey(), tc -> tc));

    // If replace=true, uncheck everything not in incoming
    if (Boolean.TRUE.equals(req.replace)) {
      for (ThesisChecklist e : existing.values()) {
        if (!incomingKeys.contains(e.getItem().getKey()) && e.isChecked()) {
          e.setChecked(false);
          e.setCheckedBy(me);
          e.setCheckedAt(Instant.now());
          tchecks.save(e);
        }
      }
    }

    // For every incoming key, ensure there's a ThesisChecklist checked=true
    for (String k : incomingKeys) {
      ChecklistItem item = items.findByKey(k).orElseGet(() -> {
        ChecklistItem ci = new ChecklistItem();
        ci.setKey(k);
        ci.setLabel(k);
        ci.setCategory(null);
        return items.save(ci);
      });

      ThesisChecklist tc = existing.get(k);
      if (tc == null) {
        tc = ThesisChecklist.builder()
          .thesis(thesis)
          .item(item)
          .checked(true)
          .checkedBy(me)
          .checkedAt(Instant.now())
          .build();
      } else {
        tc.setChecked(true);
        tc.setCheckedBy(me);
        tc.setCheckedAt(Instant.now());
      }
      tchecks.save(tc);
    }

    return ResponseEntity.ok(Map.of("thesisId", thesis.getId(), "checked", incomingKeys));
  }

  /** Approve or request revisions with notes */
  @PostMapping("/theses/{id}/decision")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> libraryDecision(
      @PathVariable Long id,
      @RequestBody Decision req
  ) {
    var me = current.requireCurrentUser();
    var thesis = theses.findById(id).orElse(null);
    if (thesis == null) {
      return ResponseEntity.notFound().build();
    }

    Thesis.ThesisStatus next;
    Approval.Status astatus;
    String s = req.status.toUpperCase();

    switch (s) {
      case "APPROVE" -> {
        next = Thesis.ThesisStatus.APPROVED;
        astatus = Approval.Status.APPROVED;
      }
      case "NOT_APPROVED", "REVISIONS_REQUIRED" -> {
        next = Thesis.ThesisStatus.LIBRARY_CHANGES;
        astatus = Approval.Status.CHANGES_REQUESTED;
      }
      default -> {
        return ResponseEntity.badRequest().body(
          Map.of("error",
            "status must be APPROVE or NOT_APPROVED/REVISIONS_REQUIRED"));
      }
    }

    thesis.setCurrentStatus(next);
    theses.save(thesis);

    approvals.save(Approval.builder()
      .thesis(thesis)
      .stage(Approval.Stage.LIBRARY)
      .status(astatus)
      .notes(req.notes)
      .decidedBy(me)
      .decidedAt(Instant.now())
      .build());

    return ResponseEntity.ok(
      Map.of("thesisId", thesis.getId(), "status", thesis.getCurrentStatus().name()));
  }

  /** Publish approved thesis to public repository */
  @PostMapping("/theses/{id}/publish")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> publishThesis(@PathVariable Long id) {
    var thesis = theses.findById(id).orElse(null);
    if (thesis == null) {
      return ResponseEntity.notFound().build();
    }

    // Only approved theses can be published
    if (thesis.getCurrentStatus() != Thesis.ThesisStatus.APPROVED) {
      return ResponseEntity.badRequest().body(
        Map.of("error", "Only APPROVED theses can be published. Current status: " + thesis.getCurrentStatus()));
    }

    // Update status to PUBLISHED
    thesis.setCurrentStatus(Thesis.ThesisStatus.PUBLISHED);
    thesis.setPublishedAt(Instant.now());
    
    // Set yearPublished from submittedAt if not already set
    if (thesis.getYearPublished() == null && thesis.getSubmittedAt() != null) {
      thesis.setYearPublished(java.time.Year.from(thesis.getSubmittedAt()).getValue());
    }
    
    theses.save(thesis);

    return ResponseEntity.ok(Map.of(
      "thesisId", thesis.getId(),
      "status", thesis.getCurrentStatus().name(),
      "publishedAt", thesis.getPublishedAt().toString()
    ));
  }

  // ──────────────────────────────────────────────────────────────────────────
  // NEW: Student account lookup for admin portal
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * List / search student accounts so admin can verify registration.
   *
   * - GET /api/admin/students
   *      → list all students
   * - GET /api/admin/students?email=foo@bar
   *      → filter by email (exact match)
   * - GET /api/admin/students?studentNumber=123
   *      → filter by student number
   */
  @GetMapping("/students")
  @PreAuthorize("hasRole('ADMIN')")
  public List<StudentAccountDto> listStudents(
      @RequestParam(required = false) String email,
      @RequestParam(required = false) String studentNumber
  ) {
    // search by email, if provided
    if (email != null && !email.isBlank()) {
      return users.findByEmail(email)
        .filter(u -> u.getRole() == Role.STUDENT)
        .map(u -> {
          StudentProfile profile =
            studentProfiles.findByUserId(u.getId()).orElse(null);
          return StudentAccountDto.from(u, profile);
        })
        .map(List::of)
        .orElseGet(List::of);
    }

    // or search by student number
    if (studentNumber != null && !studentNumber.isBlank()) {
      return studentProfiles.findByStudentNumber(studentNumber)
        .map(p -> StudentAccountDto.from(p.getUser(), p))
        .map(List::of)
        .orElseGet(List::of);
    }

    // otherwise, list all students
    return studentProfiles.findAll().stream()
      .map(p -> StudentAccountDto.from(p.getUser(), p))
      .toList();
  }

  /**
   * List all lecturers in the system
   * GET /api/admin/lecturers
   */
  @GetMapping("/lecturers")
  @PreAuthorize("hasRole('ADMIN')")
  public List<LecturerAccountDto> listLecturers() {
    return users.findAll().stream()
      .filter(u -> u.getRole() == Role.LECTURER)
      .map(u -> {
        var profile = lecturerProfiles.findByUserId(u.getId()).orElse(null);
        return LecturerAccountDto.from(u, profile);
      })
      .toList();
  }

  /**
   * List all thesis submissions for admin review
   * GET /api/admin/submissions
   */
  @GetMapping("/submissions")
  @PreAuthorize("hasRole('ADMIN')")
  public List<Map<String, Object>> listSubmissions() {
    List<Map<String, Object>> result = new ArrayList<>();
    
    for (Thesis thesis : theses.findAll()) {
      // Use thesis.studentName as primary source (set when thesis is submitted)
      String studentName = thesis.getStudentName();
      if (studentName == null || studentName.isBlank()) {
        // Fallback: try to get from StudentProfile
        User student = thesis.getStudent();
        StudentProfile studentProfile = studentProfiles.findById(student.getId()).orElse(null);
        studentName = studentProfile != null && studentProfile.getName() != null ? 
          studentProfile.getName() : student.getEmail();
      }
      
      result.add(Map.of(
        "submissionId", thesis.getId(),
        "studentId", thesis.getStudent().getId(),
        "studentName", studentName,
        "thesisTitle", thesis.getTitle() != null ? thesis.getTitle() : "--",
        "status", thesis.getCurrentStatus() != null ? thesis.getCurrentStatus().name() : "--",
        "submittedDate", thesis.getSubmittedAt() != null ? thesis.getSubmittedAt().toString() : "--"
      ));
    }
    
    return result;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // DTOs / payloads
  // ──────────────────────────────────────────────────────────────────────────

  public static class ChecklistPayload {
    public List<String> keys; // legacy/simple mode
    public List<ChecklistSelection> selections; // recommended (auto-create items)
    public Boolean replace = true;
  }

  public static class ChecklistSelection {
    @NotNull public String key;
    public String label;
    public String category;
  }

  public static class Decision {
    @NotNull public String status; // APPROVE or NOT_APPROVED/REVISIONS_REQUIRED
    public String notes;
  }

  public record LecturerAccountDto(
      Long id,
      String email,
      String name,
      String department,
      String faculty,
      String major,
      String role
  ) {
    public static LecturerAccountDto from(User u, LecturerProfile p) {
      return new LecturerAccountDto(
        u.getId(),
        u.getEmail(),
        p != null ? p.getName() : null,
        p != null ? p.getDepartment() : null,
        p != null ? p.getFaculty() : null,
        p != null ? p.getMajor() : null,
        u.getRole().name()
      );
    }
  }

  public record StudentAccountDto(
      Long id,
      String email,
      String name,
      String studentNumber,
      String program,
      String faculty,
      String role
  ) {
    public static StudentAccountDto from(User u, StudentProfile p) {
      return new StudentAccountDto(
        u.getId(),
        u.getEmail(),
        p != null ? p.getName() : null,
        p != null ? p.getStudentNumber() : null,
        p != null ? p.getProgram() : null,
        p != null ? p.getFaculty() : null,
        u.getRole().name()
      );
    }
  }
}
