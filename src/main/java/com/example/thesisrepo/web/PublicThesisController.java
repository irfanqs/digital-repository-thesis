package com.example.thesisrepo.web;

import com.example.thesisrepo.thesis.Thesis;
import com.example.thesisrepo.thesis.ThesisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Public API for searching published theses in the digital repository.
 * No authentication required.
 */
@RestController
@RequestMapping("/api/public/theses")
@RequiredArgsConstructor
public class PublicThesisController {

  private final ThesisRepository theses;

  /**
   * Search published theses with various filters
   * GET /api/public/theses/search
   * 
   * Query parameters:
   * - keyword: search in title, abstract, keywords
   * - year: filter by publication year
   * - faculty: filter by faculty
   * - major: filter by major/program
   * - author: search by student email or name
   */
  @GetMapping("/search")
  public ResponseEntity<?> searchPublished(
      @RequestParam(required = false) String keyword,
      @RequestParam(required = false) Integer year,
      @RequestParam(required = false) String faculty,
      @RequestParam(required = false) String major,
      @RequestParam(required = false) String author
  ) {
    // Get all published theses
    List<Thesis> results = theses.findByCurrentStatus(Thesis.ThesisStatus.PUBLISHED);

    // Apply filters
    if (keyword != null && !keyword.isBlank()) {
      String kw = keyword.toLowerCase();
      results = results.stream()
        .filter(t -> 
          (t.getTitle() != null && t.getTitle().toLowerCase().contains(kw)) ||
          (t.getAbstractText() != null && t.getAbstractText().toLowerCase().contains(kw)) ||
          (t.getKeywords() != null && t.getKeywords().toLowerCase().contains(kw))
        )
        .collect(Collectors.toList());
    }

    if (year != null) {
      results = results.stream()
        .filter(t -> year.equals(t.getYearPublished()))
        .collect(Collectors.toList());
    }

    if (faculty != null && !faculty.isBlank()) {
      results = results.stream()
        .filter(t -> faculty.equalsIgnoreCase(t.getFaculty()))
        .collect(Collectors.toList());
    }

    if (major != null && !major.isBlank()) {
      results = results.stream()
        .filter(t -> major.equalsIgnoreCase(t.getMajor()))
        .collect(Collectors.toList());
    }

    if (author != null && !author.isBlank()) {
      String auth = author.toLowerCase();
      results = results.stream()
        .filter(t -> 
          t.getStudent() != null && 
          t.getStudent().getEmail() != null &&
          t.getStudent().getEmail().toLowerCase().contains(auth)
        )
        .collect(Collectors.toList());
    }

    // Transform to summary DTOs (don't expose everything)
    List<Map<String, Object>> summaries = results.stream()
      .map(t -> {
        Map<String, Object> summary = new java.util.HashMap<>();
        summary.put("id", t.getId());
        summary.put("title", t.getTitle());
        summary.put("abstractText", t.getAbstractText());
        summary.put("keywords", t.getKeywords());
        summary.put("faculty", t.getFaculty());
        summary.put("major", t.getMajor());
        summary.put("yearPublished", t.getYearPublished());
        summary.put("publishedAt", t.getPublishedAt() != null ? t.getPublishedAt().toString() : null);
        summary.put("author", t.getStudent() != null ? t.getStudent().getEmail() : null);
        return summary;
      })
      .collect(Collectors.toList());

    return ResponseEntity.ok(Map.of(
      "total", summaries.size(),
      "results", summaries
    ));
  }

  /**
   * Get details of a specific published thesis
   * GET /api/public/theses/{id}
   */
  @GetMapping("/{id}")
  public ResponseEntity<?> getPublishedThesis(@PathVariable Long id) {
    var thesis = theses.findById(id).orElse(null);
    
    if (thesis == null) {
      return ResponseEntity.notFound().build();
    }

    // Only allow access to published theses
    if (thesis.getCurrentStatus() != Thesis.ThesisStatus.PUBLISHED) {
      return ResponseEntity.status(403).body(
        Map.of("error", "This thesis is not publicly available")
      );
    }

    Map<String, Object> details = new java.util.HashMap<>();
    details.put("id", thesis.getId());
    details.put("title", thesis.getTitle());
    details.put("abstractText", thesis.getAbstractText());
    details.put("keywords", thesis.getKeywords());
    details.put("faculty", thesis.getFaculty());
    details.put("major", thesis.getMajor());
    details.put("yearPublished", thesis.getYearPublished());
    details.put("publishedAt", thesis.getPublishedAt() != null ? thesis.getPublishedAt().toString() : null);
    details.put("author", thesis.getStudent() != null ? thesis.getStudent().getEmail() : null);
    details.put("filePath", thesis.getFilePath());

    return ResponseEntity.ok(details);
  }
}
