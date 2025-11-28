package com.example.thesisrepo.thesis;

import com.example.thesisrepo.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Thesis {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "student_id")
  private User student;

  @Column(nullable = false)
  private String title;

  @Column(columnDefinition = "text")
  private String abstractText;

  private String keywords;

  /** For S3 or disk locator (e.g., s3://bucket/key) */
  private String filePath;

  private Instant submittedAt;

  /** Year the thesis was published (e.g., 2025) */
  private Integer yearPublished;

  /** Faculty/School (e.g., "Faculty of Business") */
  private String faculty;

  /** Major/Program (e.g., "Computer Science") */
  private String major;

  /** When the thesis was published to public repository */
  private Instant publishedAt;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  @Builder.Default
  private ThesisStatus currentStatus = ThesisStatus.DRAFT;

  public enum ThesisStatus {
    DRAFT,
    SUBMITTED,

    /** Deprecated: supervisor cannot change submissions (kept for backward compat). */
    @Deprecated SUPERVISOR_REVIEW,
    @Deprecated SUPERVISOR_CHANGES,
    @Deprecated SUPERVISOR_APPROVED,

    LIBRARY_REVIEW,
    LIBRARY_CHANGES,
    APPROVED,
    PUBLISHED
  }
}
