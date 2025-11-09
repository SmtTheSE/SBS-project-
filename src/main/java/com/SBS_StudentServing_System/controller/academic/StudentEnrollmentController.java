package com.SBS_StudentServing_System.controller.academic;

import com.SBS_StudentServing_System.dto.academic.StudentEnrollmentDto;
import com.SBS_StudentServing_System.service.academic.StudentEnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/academic/student-enrollments")
public class StudentEnrollmentController {

    @Autowired
    private StudentEnrollmentService studentEnrollmentService;

    @GetMapping
    public ResponseEntity<List<StudentEnrollmentDto>> getAllStudentEnrollments() {
        List<StudentEnrollmentDto> studentEnrollments = studentEnrollmentService.getAllStudentEnrollments();
        return new ResponseEntity<>(studentEnrollments, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentEnrollmentDto> getStudentEnrollmentById(@PathVariable Long id) {
        Optional<StudentEnrollmentDto> studentEnrollment = studentEnrollmentService.getStudentEnrollmentById(id);
        return studentEnrollment.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<StudentEnrollmentDto> createStudentEnrollment(@RequestBody StudentEnrollmentDto studentEnrollmentDto) {
        try {
            StudentEnrollmentDto createdStudentEnrollment = studentEnrollmentService.createStudentEnrollment(studentEnrollmentDto);
            return new ResponseEntity<>(createdStudentEnrollment, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentEnrollmentDto> updateStudentEnrollment(@PathVariable Long id, @RequestBody StudentEnrollmentDto studentEnrollmentDto) {
        try {
            StudentEnrollmentDto updatedStudentEnrollment = studentEnrollmentService.updateStudentEnrollment(id, studentEnrollmentDto);
            return new ResponseEntity<>(updatedStudentEnrollment, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteStudentEnrollment(@PathVariable Long id) {
        try {
            studentEnrollmentService.deleteStudentEnrollment(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}