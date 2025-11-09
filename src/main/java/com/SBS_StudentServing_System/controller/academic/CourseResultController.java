package com.SBS_StudentServing_System.controller.academic;

import com.SBS_StudentServing_System.dto.academic.CourseResultDto;
import com.SBS_StudentServing_System.service.academic.CourseResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/academic/course-results")
public class CourseResultController {

    @Autowired
    private CourseResultService courseResultService;

    @GetMapping
    public ResponseEntity<List<CourseResultDto>> getAllCourseResults() {
        List<CourseResultDto> courseResults = courseResultService.getAllCourseResults();
        return new ResponseEntity<>(courseResults, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseResultDto> getCourseResultById(@PathVariable Long id) {
        Optional<CourseResultDto> courseResult = courseResultService.getCourseResultById(id);
        return courseResult.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<CourseResultDto> createCourseResult(@RequestBody CourseResultDto courseResultDto) {
        try {
            CourseResultDto createdCourseResult = courseResultService.createCourseResult(courseResultDto);
            return new ResponseEntity<>(createdCourseResult, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseResultDto> updateCourseResult(@PathVariable Long id, @RequestBody CourseResultDto courseResultDto) {
        try {
            CourseResultDto updatedCourseResult = courseResultService.updateCourseResult(id, courseResultDto);
            return new ResponseEntity<>(updatedCourseResult, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteCourseResult(@PathVariable Long id) {
        try {
            courseResultService.deleteCourseResult(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}