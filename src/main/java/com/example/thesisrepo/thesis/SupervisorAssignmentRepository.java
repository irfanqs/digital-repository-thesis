package com.example.thesisrepo.thesis;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupervisorAssignmentRepository extends JpaRepository<SupervisorAssignment, Long> {

  // Check if a supervisor link already exists between this lecturer and student
  boolean existsByLecturerIdAndStudentId(Long lecturerId, Long studentId);

  // For lecturer portal: find all supervisees of this lecturer
  List<SupervisorAssignment> findByLecturerId(Long lecturerId);

  // For student portal: find all supervisors of this student
  List<SupervisorAssignment> findByStudentId(Long studentId);
}
