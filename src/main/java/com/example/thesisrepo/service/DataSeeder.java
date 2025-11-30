package com.example.thesisrepo.service;

import com.example.thesisrepo.profile.StudentProfile;
import com.example.thesisrepo.profile.StudentProfileRepository;
import com.example.thesisrepo.profile.LecturerProfile;
import com.example.thesisrepo.profile.LecturerProfileRepository;
import com.example.thesisrepo.thesis.Thesis;
import com.example.thesisrepo.thesis.ThesisRepository;
import com.example.thesisrepo.user.Role;
import com.example.thesisrepo.user.User;
import com.example.thesisrepo.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component @RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
  private final UserRepository users;
  private final StudentProfileRepository studentProfiles;
  private final LecturerProfileRepository lecturerProfiles;
  private final ThesisRepository thesisRepository;
  private final PasswordEncoder encoder;

  @Override
  public void run(String... args) {
    seedAdmin("admin@univ.local", "Admin123!", "System Administrator");
    seedLecturer(
      "wandy.wandy@sampoernauniversity.ac.id", 
      "WandyLecturerIS!01", 
      "Wandy", 
      "Information Systems",
      "Faculty of Engineering and Technology (FET)",
      "Information Systems"
    );
    seedLecturer(
      "rafie.djajasoepena@sampoernauniversity.ac.id", 
      "RafieDjajasoepenaIS!02", 
      "Rafie Djajasoepena", 
      "Information Systems",
      "Faculty of Engineering and Technology (FET)",
      "Computer Science"
    );
    
    // Seed students
    seedStudent(
      "ahmad.rizki@student.sampoernauniversity.ac.id",
      "AhmadStudent!01",
      "Ahmad Rizki",
      "STU001",
      "Information Systems",
      "Faculty of Engineering and Technology (FET)"
    );
    seedStudent(
      "siti.nurhaliza@student.sampoernauniversity.ac.id",
      "SitiStudent!02",
      "Siti Nurhaliza",
      "STU002",
      "Computer Science",
      "Faculty of Engineering and Technology (FET)"
    );
    seedStudent(
      "student1@univ.local",
      "Student123!",
      "Student1",
      "STU003",
      "Computer Science",
      "Faculty of Engineering and Technology (FET)"
    );
    
    // Seed dummy theses
    seedDummyTheses();
  }

  private void seedAdmin(String email, String rawPass, String name) {
    if (!users.existsByEmail(email)) {
      users.save(User.builder()
        .email(email)
        .passwordHash(encoder.encode(rawPass))
        .role(Role.ADMIN)
        .build());
    }
  }

  private void seedLecturer(String email, String rawPass, String name, String department, String faculty, String major) {
    if (!users.existsByEmail(email)) {
      User user = users.save(User.builder()
        .email(email)
        .passwordHash(encoder.encode(rawPass))
        .role(Role.LECTURER)
        .build());
      
      lecturerProfiles.save(LecturerProfile.builder()
        .userId(user.getId())
        .user(user)
        .name(name)
        .department(department)
        .faculty(faculty)
        .major(major)
        .build());
    }
  }

  private void seedStudent(String email, String rawPass, String name, String studentNumber, String program, String faculty) {
    if (!users.existsByEmail(email)) {
      User user = users.save(User.builder()
        .email(email)
        .passwordHash(encoder.encode(rawPass))
        .role(Role.STUDENT)
        .build());
      
      studentProfiles.save(StudentProfile.builder()
        .userId(user.getId())
        .user(user)
        .name(name)
        .studentNumber(studentNumber)
        .program(program)
        .faculty(faculty)
        .build());
    }
  }

  private void seedDummyTheses() {
    if (thesisRepository.count() > 0) {
      return; // Already seeded
    }

    // Get actual student users
    User ahmadRizki = users.findByEmail("ahmad.rizki@student.sampoernauniversity.ac.id").orElse(null);
    User sitiNurhaliza = users.findByEmail("siti.nurhaliza@student.sampoernauniversity.ac.id").orElse(null);
    
    // If students don't exist, we can't seed theses - just return
    if (ahmadRizki == null || sitiNurhaliza == null) {
      return;
    }

    // Thesis 1 - Siti Nurhaliza with Rafie Djajasoepena
    thesisRepository.save(Thesis.builder()
      .student(sitiNurhaliza)
      .title("Blockchain Technology for Supply Chain Transparency in Indonesia")
      .abstractText("This study investigates the implementation of blockchain technology to enhance transparency and traceability in Indonesian supply chains. Through a pilot project with local manufacturers, we demonstrated how distributed ledger technology can reduce fraud, improve accountability, and streamline logistics operations across multiple stakeholders.")
      .studentName("Siti Nurhaliza")
      .supervisorName("Rafie Djajasoepena")
      .program("Computer Science")
      .submissionYear(2024)
      .yearPublished(2024)
      .faculty("Faculty of Engineering and Technology (FET)")
      .major("Computer Science")
      .keywords("blockchain, supply chain, transparency, distributed ledger")
      .currentStatus(Thesis.ThesisStatus.PUBLISHED)
      .publishedAt(Instant.now())
      .submittedAt(Instant.now())
      .build());

    // Thesis 2 - Ahmad Rizki with Wandy
    thesisRepository.save(Thesis.builder()
      .student(ahmadRizki)
      .title("Natural Language Processing for Sentiment Analysis of Indonesian Social Media")
      .abstractText("This research develops NLP models specifically tuned for Indonesian language sentiment analysis on social media platforms. Using a dataset of over 500,000 Indonesian tweets, we achieved 88% accuracy in sentiment classification. The findings provide valuable insights for businesses and policymakers monitoring public opinion in Indonesia.")
      .studentName("Ahmad Rizki")
      .supervisorName("Wandy")
      .program("Information Systems")
      .submissionYear(2023)
      .yearPublished(2023)
      .faculty("Faculty of Engineering and Technology (FET)")
      .major("Information Systems")
      .keywords("NLP, sentiment analysis, Indonesian language, social media")
      .currentStatus(Thesis.ThesisStatus.PUBLISHED)
      .publishedAt(Instant.now())
      .submittedAt(Instant.now())
      .build());

    // Thesis 3 - Ahmad Rizki with Rafie Djajasoepena
    thesisRepository.save(Thesis.builder()
      .student(ahmadRizki)
      .title("Cloud-Native Architecture for E-Commerce Scalability")
      .abstractText("This thesis presents a cloud-native architecture design for high-traffic e-commerce platforms. By leveraging microservices, containerization, and serverless computing, we achieved 10x improvement in scalability while reducing infrastructure costs by 40%. The research includes detailed performance benchmarks and cost analysis.")
      .studentName("Ahmad Rizki")
      .supervisorName("Rafie Djajasoepena")
      .program("Information Systems")
      .submissionYear(2023)
      .yearPublished(2023)
      .faculty("Faculty of Engineering and Technology (FET)")
      .major("Information Systems")
      .keywords("cloud computing, microservices, e-commerce, scalability")
      .currentStatus(Thesis.ThesisStatus.PUBLISHED)
      .publishedAt(Instant.now())
      .submittedAt(Instant.now())
      .build());

    // Thesis 4 - Siti Nurhaliza with Wandy
    thesisRepository.save(Thesis.builder()
      .student(sitiNurhaliza)
      .title("Cybersecurity Framework for Indonesian Banking Systems")
      .abstractText("This study proposes a comprehensive cybersecurity framework tailored for Indonesian banking institutions. Drawing from international best practices and local regulatory requirements, the framework addresses common vulnerabilities and provides actionable security measures. Implementation at a regional bank showed 65% reduction in security incidents.")
      .studentName("Siti Nurhaliza")
      .supervisorName("Wandy")
      .program("Computer Science")
      .submissionYear(2024)
      .yearPublished(2024)
      .faculty("Faculty of Engineering and Technology (FET)")
      .major("Computer Science")
      .keywords("cybersecurity, banking, risk management, Indonesia")
      .currentStatus(Thesis.ThesisStatus.PUBLISHED)
      .publishedAt(Instant.now())
      .submittedAt(Instant.now())
      .build());
  }
}
