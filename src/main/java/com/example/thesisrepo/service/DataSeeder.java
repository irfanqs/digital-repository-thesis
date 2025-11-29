package com.example.thesisrepo.service;

import com.example.thesisrepo.profile.StudentProfile;
import com.example.thesisrepo.profile.StudentProfileRepository;
import com.example.thesisrepo.profile.LecturerProfile;
import com.example.thesisrepo.profile.LecturerProfileRepository;
import com.example.thesisrepo.user.Role;
import com.example.thesisrepo.user.User;
import com.example.thesisrepo.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component @RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
  private final UserRepository users;
  private final StudentProfileRepository studentProfiles;
  private final LecturerProfileRepository lecturerProfiles;
  private final PasswordEncoder encoder;

  @Override
  public void run(String... args) {
    seedAdmin("admin@univ.local", "Admin123!");
    seedLecturer("lecturer@univ.local", "Lecturer123!", "1234567890", "Computer Science");
    seedStudent("student@univ.local", "Student123!", "2021001", "Bachelor of Computer Science");
  }

  private void seedAdmin(String email, String rawPass) {
    if (!users.existsByEmail(email)) {
      users.save(User.builder()
        .email(email)
        .passwordHash(encoder.encode(rawPass))
        .role(Role.ADMIN)
        .build());
    }
  }

  private void seedLecturer(String email, String rawPass, String nidn, String department) {
    if (!users.existsByEmail(email)) {
      User user = users.save(User.builder()
        .email(email)
        .passwordHash(encoder.encode(rawPass))
        .role(Role.LECTURER)
        .build());
      
      lecturerProfiles.save(LecturerProfile.builder()
        .user(user)
        .nidn(nidn)
        .department(department)
        .build());
    }
  }

  private void seedStudent(String email, String rawPass, String studentNumber, String program) {
    if (!users.existsByEmail(email)) {
      User user = users.save(User.builder()
        .email(email)
        .passwordHash(encoder.encode(rawPass))
        .role(Role.STUDENT)
        .build());
      
      studentProfiles.save(StudentProfile.builder()
        .user(user)
        .studentNumber(studentNumber)
        .program(program)
        .build());
    }
  }
}
