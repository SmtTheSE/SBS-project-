package com.SBS_StudentServing_System.controller.academic;

import com.SBS_StudentServing_System.dto.academic.StudyPlanCourseDto;
import com.SBS_StudentServing_System.service.academic.StudyPlanCourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/academic/study-plan-courses")
@PreAuthorize("hasRole('ADMIN')")
public class StudyPlanCourseController {

    @Autowired
    private StudyPlanCourseService studyPlanCourseService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<StudyPlanCourseDto> getAllStudyPlanCourses() {
        return studyPlanCourseService.getAllStudyPlanCourses();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public StudyPlanCourseDto getStudyPlanCourseById(@PathVariable String id) {
        return studyPlanCourseService.getStudyPlanCourseById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public StudyPlanCourseDto createStudyPlanCourse(@RequestBody StudyPlanCourseDto dto) {
        return studyPlanCourseService.createStudyPlanCourse(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public StudyPlanCourseDto updateStudyPlanCourse(@PathVariable String id, @RequestBody StudyPlanCourseDto dto) {
        return studyPlanCourseService.updateStudyPlanCourse(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public boolean deleteStudyPlanCourse(@PathVariable String id) {
        return studyPlanCourseService.deleteStudyPlanCourse(id);
    }
}