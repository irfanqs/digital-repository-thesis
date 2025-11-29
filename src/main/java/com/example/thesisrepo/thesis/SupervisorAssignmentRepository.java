package com.example.thesisrepo.thesis;

import com.example.thesisrepo.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupervisorAssignmentRepository extends JpaRepository<SupervisorAssignment, Long> {

  // Check if a supervisor link already exists between this lecturer and student
  boolean existsByLecturerIdAndStudentId(Long lecturerId, Long studentId);
  boolean existsByLecturerAndStudent(User lecturer, User student);

  // For lecturer portal: find all supervisees of this lecturer
  List<SupervisorAssignment> findByLecturerId(Long lecturerId);
  List<SupervisorAssignment> findByLecturer(User lecturer);

  // For student portal: find all supervisors of this student
  List<SupervisorAssignment> findByStudentId(Long studentId);
  List<SupervisorAssignment> findByStudent(User student);
}
