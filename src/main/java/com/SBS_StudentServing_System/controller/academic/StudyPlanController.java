package com.SBS_StudentServing_System.controller.academic;

import com.SBS_StudentServing_System.dto.academic.StudyPlanDto;
import com.SBS_StudentServing_System.service.academic.AcademicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/academic/study-plans")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('ADMIN')")
public class StudyPlanController {

    @Autowired
    private AcademicService academicService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<StudyPlanDto> getAllStudyPlans() {
        return academicService.getAllStudyPlansWithDto();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public StudyPlanDto getStudyPlanById(@PathVariable String id) {
        return academicService.getStudyPlanById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public StudyPlanDto createStudyPlan(@RequestBody StudyPlanDto studyPlanDto) {
        return academicService.createStudyPlan(studyPlanDto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public StudyPlanDto updateStudyPlan(@PathVariable String id, @RequestBody StudyPlanDto studyPlanDto) {
        return academicService.updateStudyPlan(id, studyPlanDto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public boolean deleteStudyPlan(@PathVariable String id) {
        return academicService.deleteStudyPlan(id);
    }
}