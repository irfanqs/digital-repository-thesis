package com.example.thesisrepo.service;

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
  private final PasswordEncoder encoder;

  @Override
  public void run(String... args) {
    seed("admin@univ.local", "Admin123!", Role.ADMIN);
    seed("lecturer@univ.local", "Lecturer123!", Role.LECTURER);
  }

  private void seed(String email, String rawPass, Role role) {
    if (!users.existsByEmail(email)) {
      users.save(User.builder()
        .email(email)
        .passwordHash(encoder.encode(rawPass))
        .role(role)
        .build());
    }
  }
}
