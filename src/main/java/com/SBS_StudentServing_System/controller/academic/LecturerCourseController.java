package com.SBS_StudentServing_System.controller.academic;

import com.SBS_StudentServing_System.dto.academic.LecturerCourseDto;
import com.SBS_StudentServing_System.service.academic.LecturerCourseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/lecturer-courses")
public class LecturerCourseController {

    private final LecturerCourseService lecturerCourseService;

    public LecturerCourseController(LecturerCourseService lecturerCourseService) {
        this.lecturerCourseService = lecturerCourseService;
    }

    @GetMapping
    public List<LecturerCourseDto> getAllLecturerCourses() {
        return lecturerCourseService.getAllLecturerCourses();
    }

    @GetMapping("/{id}")
    public LecturerCourseDto getLecturerCourse(@PathVariable("id") Long id) {
        return lecturerCourseService.getLecturerCourse(id);
    }

    @PostMapping
    public LecturerCourseDto createLecturerCourse(@RequestBody LecturerCourseDto dto) {
        return lecturerCourseService.createLecturerCourse(dto);
    }

    @PutMapping("/{id}")
    public LecturerCourseDto updateLecturerCourse(@PathVariable("id") Long id, @RequestBody LecturerCourseDto dto) {
        return lecturerCourseService.updateLecturerCourse(id, dto);
    }

    @DeleteMapping("/{id}")
    public boolean deleteLecturerCourse(@PathVariable("id") Long id) {
        return lecturerCourseService.deleteLecturerCourse(id);
    }
}