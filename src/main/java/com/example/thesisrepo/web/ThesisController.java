package com.example.thesisrepo.web;

import com.example.thesisrepo.service.CurrentUserService;
import com.example.thesisrepo.service.StorageService;
import com.example.thesisrepo.thesis.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/theses")
@RequiredArgsConstructor
public class ThesisController {
  private final ThesisRepository theses;
  private final CurrentUserService current;
  private final StorageService storage;
  private final ThesisChecklistRepository checklistRepo;
  private final ApprovalRepository approvalRepo;

  /** Student's own submissions (multiple attempts supported). */
  @GetMapping("/mine")
  @PreAuthorize("hasRole('STUDENT')")
  public List<Thesis> mine() {
    var me = current.requireCurrentUser();
    return theses.findByStudentId(me.getId());
  }

  /** Submit a thesis (new attempt). */
  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @PreAuthorize("hasRole('STUDENT')")
  public ResponseEntity<?> submit(@RequestPart("meta") SubmitMeta meta,
                                  @RequestPart("file") MultipartFile file) {
    var me = current.requireCurrentUser();

    if (file == null || file.isEmpty()) {
      return ResponseEntity.badRequest().body(Map.of("error", "PDF file is required"));
    }

    String objectKey = LocalDate.now().toString().substring(0, 7) + "/" + UUID.randomUUID() + ".pdf";
    String locator;
    try {
      locator = storage.savePdf(file, objectKey);
    } catch (Exception e) {
      return ResponseEntity.internalServerError()
        .body(Map.of("error", "File save failed", "details", e.getMessage()));
    }

    var t = Thesis.builder()
      .student(me)
      .title(meta.getTitle())
      .abstractText(meta.getAbstractText())
      .keywords(meta.getKeywords())
      .faculty(meta.getFaculty())
      .major(meta.getMajor())
      .filePath(locator)
      .submittedAt(Instant.now())
      .currentStatus(Thesis.ThesisStatus.LIBRARY_REVIEW) // goes to library queue
      .build();

    theses.save(t);

    return ResponseEntity.ok(Map.of(
      "id", t.getId(),
      "status", t.getCurrentStatus(),
      "file", t.getFilePath()
    ));
  }

  /** Get feedback (checklist + approval notes) for a specific thesis */
  @GetMapping("/{id}/feedback")
  @PreAuthorize("hasRole('STUDENT')")
  public ResponseEntity<?> getFeedback(@PathVariable Long id) {
    var me = current.requireCurrentUser();
    var thesis = theses.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Thesis not found"));

    // Verify ownership
    if (!thesis.getStudent().getId().equals(me.getId())) {
      return ResponseEntity.status(403).body(Map.of("error", "Not your thesis"));
    }

    // Get checklist items
    List<ThesisChecklist> checklists = checklistRepo.findByThesisId(id);
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
    List<Approval> approvals = approvalRepo.findByThesisId(id);
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
      "thesisId", id,
      "checklist", checklistData,
      "approvals", approvalData
    ));
  }

  @Data
  public static class SubmitMeta {
    @NotBlank private String title;
    private String abstractText;
    private String keywords;
    private String faculty;
    private String major;
  }
}
