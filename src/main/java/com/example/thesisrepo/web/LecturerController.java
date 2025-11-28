package com.example.thesisrepo.web;

import com.example.thesisrepo.profile.LecturerProfile;
import com.example.thesisrepo.profile.LecturerProfileRepository;
import com.example.thesisrepo.service.CurrentUserService;
import com.example.thesisrepo.thesis.*;
import com.example.thesisrepo.user.Role;
import com.example.thesisrepo.user.User;
import com.example.thesisrepo.user.UserRepository;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Endpoints related to lecturers and supervision relationships.
 *
 * Base path: /api/lecturers
 */
@RestController
@RequestMapping("/api/lecturers")
@RequiredArgsConstructor
public class LecturerController {

  private final CurrentUserService current;
  private final UserRepository users;
  private final ThesisRepository theses;
  private final SupervisorAssignmentRepository assignments;
  private final LecturerProfileRepository lecturerProfiles;
  private final ThesisChecklistRepository checklistRepo;
  private final ApprovalRepository approvalRepo;

  // ─────────────────────────────────────────────────────────────────────
  // 1. Student adds a supervisor (idempotent)
  // ─────────────────────────────────────────────────────────────────────

  /**
   * Student adds a lecturer as their supervisor.
   *
   * Request body: { "email": "lecturer@univ.local" }
   *
   * If the relationship already exists, we do nothing and still return 200 OK.
   */
  @PostMapping("/supervisees")
  @PreAuthorize("hasRole('STUDENT')")
  public ResponseEntity<?> addSupervisee(@RequestBody AddSupervisee req) {
    // Current authenticated user = student
    var me = current.requireCurrentUser();

    // Look up lecturer by email
    User lecturer = users.findByEmail(req.email())
      .orElseThrow(() -> new IllegalArgumentException("Lecturer email not found"));

    if (lecturer.getRole() != Role.LECTURER) {
      return ResponseEntity.badRequest()
        .body(Map.of("error", "Email is not a lecturer account"));
    }

    // Create link if not already there (idempotent)
    if (!assignments.existsByLecturerIdAndStudentId(lecturer.getId(), me.getId())) {
      assignments.save(SupervisorAssignment.builder()
        .lecturer(lecturer)
        .student(me)
        .build());
    }

    return ResponseEntity.ok(Map.of(
      "lecturerId", lecturer.getId(),
      "studentId", me.getId(),
      "email", lecturer.getEmail()
    ));
  }

  // ─────────────────────────────────────────────────────────────────────
  // 2. Student sees their current supervisors
  // ─────────────────────────────────────────────────────────────────────

  /**
   * For a student, return the list of their supervisors.
   *
   * GET /api/lecturers/supervisees
   *
   * Response example:
   * [
   *    { "lecturerId": 5, "email": "lecturer@univ.local", "roleMain": true }
   * ]
   */
  @GetMapping("/supervisees")
  @PreAuthorize("hasRole('STUDENT')")
  public List<Map<String, Object>> mySupervisors() {
    var me = current.requireCurrentUser();

    List<SupervisorAssignment> links = assignments.findByStudentId(me.getId());
    List<Map<String, Object>> out = new ArrayList<>();

    for (SupervisorAssignment a : links) {
      User lect = a.getLecturer();
      out.add(Map.of(
        "lecturerId", lect.getId(),
        "email", lect.getEmail(),
        "roleMain", a.isRoleMain()
      ));
    }
    return out;
  }

  // ─────────────────────────────────────────────────────────────────────
  // 3. Lecturer portal: view theses of supervisees
  // ─────────────────────────────────────────────────────────────────────

  /**
   * For a lecturer, list all theses submitted by their supervisees.
   *
   * GET /api/lecturers/theses
   */
  @GetMapping("/theses")
  @PreAuthorize("hasRole('LECTURER')")
  public List<Map<String, Object>> superviseeTheses() {
    var me = current.requireCurrentUser();

    // First find all student IDs linked to this lecturer
    var superviseeIds = assignments.findByLecturerId(me.getId()).stream()
      .map(a -> a.getStudent().getId())
      .toList();

    List<Map<String, Object>> out = new ArrayList<>();

    for (Long sid : superviseeIds) {
      for (Thesis t : theses.findByStudentId(sid)) {
        out.add(Map.of(
          "thesisId", t.getId(),
          "studentId", sid,
          "title", t.getTitle(),
          "status", t.getCurrentStatus(),
          "submittedAt", t.getSubmittedAt()
        ));
      }
    }

    return out;
  }

  /**
   * Get detailed feedback for a specific thesis (for lecturer to view)
   * GET /api/lecturers/theses/{thesisId}/feedback
   */
  @GetMapping("/theses/{thesisId}/feedback")
  @PreAuthorize("hasRole('LECTURER')")
  public ResponseEntity<?> getThesisFeedback(@PathVariable Long thesisId) {
    var me = current.requireCurrentUser();
    var thesis = theses.findById(thesisId).orElse(null);
    
    if (thesis == null) {
      return ResponseEntity.notFound().build();
    }

    // Verify this lecturer supervises this student
    boolean isSupervising = assignments.existsByLecturerIdAndStudentId(
      me.getId(), 
      thesis.getStudent().getId()
    );
    
    if (!isSupervising) {
      return ResponseEntity.status(403).body(
        Map.of("error", "You are not supervising this student")
      );
    }

    // Get checklist items
    List<ThesisChecklist> checklists = checklistRepo.findByThesisId(thesisId);
    List<Map<String, Object>> checklistData = new ArrayList<>();
    for (ThesisChecklist tc : checklists) {
      Map<String, Object> item = new HashMap<>();
      item.put("key", tc.getItem().getKey());
      item.put("label", tc.getItem().getLabel());
      item.put("checked", tc.isChecked());
      item.put("checkedAt", tc.getCheckedAt() != null ? tc.getCheckedAt().toString() : "");
      checklistData.add(item);
    }

    // Get approval/decision notes
    List<Approval> approvals = approvalRepo.findByThesisId(thesisId);
    List<Map<String, Object>> approvalData = new ArrayList<>();
    for (Approval a : approvals) {
      Map<String, Object> approval = new HashMap<>();
      approval.put("stage", a.getStage());
      approval.put("status", a.getStatus());
      approval.put("notes", a.getNotes() != null ? a.getNotes() : "");
      approval.put("decidedAt", a.getDecidedAt() != null ? a.getDecidedAt().toString() : "");
      approvalData.add(approval);
    }

    return ResponseEntity.ok(Map.of(
      "thesisId", thesisId,
      "thesisTitle", thesis.getTitle(),
      "currentStatus", thesis.getCurrentStatus(),
      "checklist", checklistData,
      "approvals", approvalData
    ));
  }

  // ─────────────────────────────────────────────────────────────────────
  // 4. List of all lecturers (for dropdown)
  // ─────────────────────────────────────────────────────────────────────

  /**
   * List all lecturers the system knows about, including their profile data.
   *
   * GET /api/lecturers/list
   *
   * Used by the student portal to populate the "Select supervisor" dropdown.
   */
  @GetMapping("/list")
  @PreAuthorize("hasAnyRole('STUDENT','ADMIN')")
  public List<LecturerSummary> listLecturers() {
    List<LecturerProfile> profiles = lecturerProfiles.findAll();

    List<LecturerSummary> out = new ArrayList<>();
    for (LecturerProfile lp : profiles) {
      User u = lp.getUser();
      out.add(new LecturerSummary(
        u.getId(),
        u.getEmail(),
        lp.getNidn(),
        lp.getDepartment()
      ));
    }
    return out;
  }

  // ─────────────────────────────────────────────────────────────────────
  // DTO records
  // ─────────────────────────────────────────────────────────────────────

  /** Request body for POST /api/lecturers/supervisees */
  public record AddSupervisee(@Email @NotNull String email) {}

  /** Summary row for the lecturer list dropdown. */
  public record LecturerSummary(
    Long id,
    String email,
    String nidn,
    String department
  ) {}
}
