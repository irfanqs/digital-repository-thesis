package com.example.thesisrepo.thesis;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ThesisChecklistRepository extends JpaRepository<ThesisChecklist, Long> {
  List<ThesisChecklist> findByThesisId(Long thesisId);
  Optional<ThesisChecklist> findByThesisIdAndItemId(Long thesisId, Long itemId);
}
