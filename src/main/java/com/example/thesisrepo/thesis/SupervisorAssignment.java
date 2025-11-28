package com.example.thesisrepo.thesis;

import com.example.thesisrepo.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"lecturer_user_id","student_user_id"}))
public class SupervisorAssignment {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false) @JoinColumn(name = "lecturer_user_id")
  private User lecturer;

  @ManyToOne(optional = false) @JoinColumn(name = "student_user_id")
  private User student;

  @Builder.Default
  private boolean roleMain = true;
}
