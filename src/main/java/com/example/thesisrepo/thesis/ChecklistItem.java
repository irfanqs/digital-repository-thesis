package com.example.thesisrepo.thesis;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "checklist_item", uniqueConstraints = {
  @UniqueConstraint(name = "uk_checklist_item_key", columnNames = "ckey")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChecklistItem {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "ckey", nullable = false, length = 200)
  private String key;

  @Column(nullable = false, length = 300)
  private String label;

  @Column(length = 200)           // <-- new field
  private String category;
}
