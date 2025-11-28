package com.example.thesisrepo.thesis;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApprovalRepository extends JpaRepository<Approval, Long> {
  List<Approval> findByThesisId(Long thesisId);
}
