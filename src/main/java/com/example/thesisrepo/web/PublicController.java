package com.example.thesisrepo.web;

import com.example.thesisrepo.thesis.ThesisRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    private final ThesisRepository thesisRepository;

    public PublicController(ThesisRepository thesisRepository) {
        this.thesisRepository = thesisRepository;
    }

    @GetMapping("/theses")
    public List<PublicThesisDto> getPublishedTheses() {
        return thesisRepository.findAll().stream()
                .filter(t -> t.getPublishedAt() != null) // Only published theses
                .map(t -> new PublicThesisDto(
                        t.getId(),
                        t.getTitle(),
                        t.getStudentName() != null ? t.getStudentName() : "Unknown",
                        t.getSupervisorName() != null ? t.getSupervisorName() : "Unknown",
                        t.getProgram() != null ? t.getProgram() : "Unknown",
                        t.getSubmissionYear() != null ? t.getSubmissionYear() : 2024,
                        t.getAbstractText() != null ? t.getAbstractText() : "No abstract available."
                ))
                .collect(Collectors.toList());
    }

    record PublicThesisDto(
            Long id,
            String title,
            String studentName,
            String supervisorName,
            String program,
            Integer year,
            String abstractText
    ) {}
}
