package com.example.thesisrepo.web;

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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository users;
    private final StudentProfileRepository studentProfiles;
    private final PasswordEncoder passwordEncoder;
    private final CurrentUserService currentUserService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody StudentRegister payload) {
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

    @GetMapping("/me")
    public MeResponse me() {
        User user = currentUserService.requireCurrentUser();
        return new MeResponse(user.getId(), user.getEmail(), user.getRole());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestParam String username,
            @RequestParam String password,
            jakarta.servlet.http.HttpServletRequest request
    ) {
        try {
            // Authenticate using Spring Security
            org.springframework.security.authentication.UsernamePasswordAuthenticationToken authToken = 
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(username, password);
            
            org.springframework.security.core.Authentication auth = 
                authenticationManager.authenticate(authToken);
            
            // Set security context
            org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(auth);
            
            // Create session
            jakarta.servlet.http.HttpSession session = request.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", 
                org.springframework.security.core.context.SecurityContextHolder.getContext());
            
            // Get user details
            User user = currentUserService.requireCurrentUser();
            
            return ResponseEntity.ok(new MeResponse(user.getId(), user.getEmail(), user.getRole()));
        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            jakarta.servlet.http.HttpServletRequest request,
            jakarta.servlet.http.HttpServletResponse response
    ) {
        // Clear Spring Security context
        org.springframework.security.core.Authentication auth = 
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        
        if (auth != null) {
            new org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler()
                .logout(request, response, auth);
        }
        
        // Invalidate session
        jakarta.servlet.http.HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        
        // Clear security context
        org.springframework.security.core.context.SecurityContextHolder.clearContext();
        
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
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
}
