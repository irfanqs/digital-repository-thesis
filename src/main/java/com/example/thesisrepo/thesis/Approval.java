package com.example.thesisrepo.thesis;

import com.example.thesisrepo.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Approval {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // Will map to approval.thesis_id (matches your DDL)
  @ManyToOne(optional = false)
  private Thesis thesis;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Stage stage;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Status status;

  // Use PostgreSQL TEXT to match your Flyway DDL
  @Column(columnDefinition = "text")
  private String notes;

  // IMPORTANT: align with Flyway column name "decided_by"
  @ManyToOne
  @JoinColumn(name = "decided_by")
  private User decidedBy;

  private Instant decidedAt;

  public enum Stage { SUPERVISOR, LIBRARY }
  public enum Status { PENDING, CHANGES_REQUESTED, APPROVED, NOT_APPROVED }
}
