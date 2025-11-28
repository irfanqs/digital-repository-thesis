package com.example.thesisrepo.thesis;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ChecklistItemRepository extends JpaRepository<ChecklistItem, Long> {
  Optional<ChecklistItem> findByKey(String key);
}
