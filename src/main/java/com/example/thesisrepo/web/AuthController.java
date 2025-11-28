package com.example.thesisrepo.web;

import com.example.thesisrepo.profile.LecturerProfile;
import com.example.thesisrepo.profile.LecturerProfileRepository;
import com.example.thesisrepo.profile.StudentProfile;
import com.example.thesisrepo.profile.StudentProfileRepository;
import com.example.thesisrepo.service.CurrentUserService;
import com.example.thesisrepo.user.Role;
import com.example.thesisrepo.user.User;
import com.example.thesisrepo.user.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository users;
    private final StudentProfileRepository studentProfiles;
    private final LecturerProfileRepository lecturerProfiles;
    private final PasswordEncoder passwordEncoder;
    private final CurrentUserService currentUserService;

    @PostMapping("/register-student")
    public ResponseEntity<?> registerStudent(@Valid @RequestBody StudentRegister payload) {
        if (users.existsByEmail(payload.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }

        User u = users.save(User.builder()
                .email(payload.getEmail())
                .passwordHash(passwordEncoder.encode(payload.getPassword()))
                .role(Role.STUDENT)
                .build());

        studentProfiles.save(StudentProfile.builder()
                .user(u)
                .studentNumber(payload.getStudentNumber())
                .program(payload.getProgram())
                .build());

        return ResponseEntity.ok(Map.of(
                "id", u.getId(),
                "email", u.getEmail(),
                "role", u.getRole()
        ));
    }

    @PostMapping("/register-lecturer")
    public ResponseEntity<?> registerLecturer(@Valid @RequestBody LecturerRegister payload) {
        if (users.existsByEmail(payload.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }

        User u = users.save(User.builder()
                .email(payload.getEmail())
                .passwordHash(passwordEncoder.encode(payload.getPassword()))
                .role(Role.LECTURER)
                .build());

        lecturerProfiles.save(LecturerProfile.builder()
                .user(u)
                .nidn(payload.getNidn())
                .department(payload.getDepartment())
                .build());

        return ResponseEntity.ok(Map.of(
                "id", u.getId(),
                "email", u.getEmail(),
                "role", u.getRole()
        ));
    }

    @PostMapping("/register-admin")
    public ResponseEntity<?> registerAdmin(@Valid @RequestBody AdminRegister payload) {
        if (users.existsByEmail(payload.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }

        User u = users.save(User.builder()
                .email(payload.getEmail())
                .passwordHash(passwordEncoder.encode(payload.getPassword()))
                .role(Role.ADMIN)
                .build());

        return ResponseEntity.ok(Map.of(
                "id", u.getId(),
                "email", u.getEmail(),
                "role", u.getRole()
        ));
    }

    @GetMapping("/me")
    public MeResponse me() {
        User user = currentUserService.requireCurrentUser();
        return new MeResponse(user.getId(), user.getEmail(), user.getRole());
    }

    public record MeResponse(Long id, String email, Role role) {}

    @Data
    public static class StudentRegister {
        @Email
        @NotBlank
        private String email;
        @NotBlank
        private String password;
        @NotBlank
        private String studentNumber;
        private String program;
    }

    @Data
    public static class LecturerRegister {
        @Email
        @NotBlank
        private String email;
        @NotBlank
        private String password;
        @NotBlank
        private String nidn;
        private String department;
    }

    @Data
    public static class AdminRegister {
        @Email
        @NotBlank
        private String email;
        @NotBlank
        private String password;
    }
}
