package com.example.thesisrepo.thesis;

import com.example.thesisrepo.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SupervisorAssignmentRepository extends JpaRepository<SupervisorAssignment, Long> {

  // Check if a supervisor link already exists between this lecturer and student
  boolean existsByLecturerIdAndStudentId(Long lecturerId, Long studentId);
  boolean existsByLecturerAndStudent(User lecturer, User student);

  // For lecturer portal: find all supervisees of this lecturer
  @Query("SELECT sa FROM SupervisorAssignment sa WHERE sa.lecturer.id = :lecturerId")
  List<SupervisorAssignment> findByLecturerId(@Param("lecturerId") Long lecturerId);
  List<SupervisorAssignment> findByLecturer(User lecturer);

  // For student portal: find all supervisors of this student
  @Query("SELECT sa FROM SupervisorAssignment sa WHERE sa.student.id = :studentId")
  List<SupervisorAssignment> findByStudentId(@Param("studentId") Long studentId);
  List<SupervisorAssignment> findByStudent(User student);
}
