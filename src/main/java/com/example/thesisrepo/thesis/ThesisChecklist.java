package com.example.thesisrepo.thesis;

import com.example.thesisrepo.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@Table(
  uniqueConstraints = @UniqueConstraint(columnNames = {"thesis_id","item_id"})
)
public class ThesisChecklist {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // Make FK column names explicit to match the Flyway DDL
  @ManyToOne(optional = false)
  @JoinColumn(name = "thesis_id")
  private Thesis thesis;

  @ManyToOne(optional = false)
  @JoinColumn(name = "item_id")
  private ChecklistItem item;

  private boolean checked;

  // IMPORTANT: column is "checked_by" (not checked_by_id)
  @ManyToOne
  @JoinColumn(name = "checked_by")
  private User checkedBy;

  private Instant checkedAt;
}
