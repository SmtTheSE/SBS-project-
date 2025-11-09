package com.SBS_StudentServing_System.controller.academic;

import com.SBS_StudentServing_System.dto.academic.StudentProgressSummaryDto;
import com.SBS_StudentServing_System.service.academic.StudentProgressSummaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/academic/student-progress-summaries")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class StudentProgressSummaryController {
    private final StudentProgressSummaryService studentProgressSummaryService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<StudentProgressSummaryDto> getAllStudentProgressSummaries() {
        return studentProgressSummaryService.getAllStudentProgressSummaries();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public StudentProgressSummaryDto getStudentProgressSummaryById(@PathVariable Long id) {
        return studentProgressSummaryService.getStudentProgressSummaryById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public StudentProgressSummaryDto createStudentProgressSummary(@RequestBody StudentProgressSummaryDto studentProgressSummaryDto) {
        return studentProgressSummaryService.createStudentProgressSummary(studentProgressSummaryDto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public StudentProgressSummaryDto updateStudentProgressSummary(@PathVariable Long id, @RequestBody StudentProgressSummaryDto studentProgressSummaryDto) {
        return studentProgressSummaryService.updateStudentProgressSummary(id, studentProgressSummaryDto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteStudentProgressSummary(@PathVariable Long id) {
        studentProgressSummaryService.deleteStudentProgressSummary(id);
    }
}