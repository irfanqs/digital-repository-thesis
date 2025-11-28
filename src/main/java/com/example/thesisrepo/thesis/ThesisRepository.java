package com.example.thesisrepo.thesis;

import com.example.thesisrepo.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ThesisRepository extends JpaRepository<Thesis, Long> {
  List<Thesis> findByStudent(User student);
  // convenience overload used by controller:
  List<Thesis> findByStudentId(Long studentId);
  List<Thesis> findByCurrentStatus(Thesis.ThesisStatus status);
}
