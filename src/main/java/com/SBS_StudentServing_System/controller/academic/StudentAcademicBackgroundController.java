package com.SBS_StudentServing_System.controller.academic;

import com.SBS_StudentServing_System.dto.academic.StudentAcademicBackgroundDto;
import com.SBS_StudentServing_System.service.academic.StudentAcademicBackgroundService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/academic/student-academic-backgrounds")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('ADMIN')")
public class StudentAcademicBackgroundController {

    @Autowired
    private StudentAcademicBackgroundService studentAcademicBackgroundService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<StudentAcademicBackgroundDto> getAllStudentAcademicBackgrounds() {
        return studentAcademicBackgroundService.getAllStudentAcademicBackgroundsWithDto();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentAcademicBackgroundDto> getStudentAcademicBackgroundById(@PathVariable String id) {
        StudentAcademicBackgroundDto background = studentAcademicBackgroundService.getStudentAcademicBackgroundById(id);
        if (background != null) {
            return ResponseEntity.ok(background);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentAcademicBackgroundDto> createStudentAcademicBackground(@RequestBody StudentAcademicBackgroundDto backgroundDto) {
        StudentAcademicBackgroundDto createdBackground = studentAcademicBackgroundService.createStudentAcademicBackground(backgroundDto);
        if (createdBackground != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(createdBackground);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentAcademicBackgroundDto> updateStudentAcademicBackground(@PathVariable String id, @RequestBody StudentAcademicBackgroundDto backgroundDto) {
        StudentAcademicBackgroundDto updatedBackground = studentAcademicBackgroundService.updateStudentAcademicBackground(id, backgroundDto);
        if (updatedBackground != null) {
            return ResponseEntity.ok(updatedBackground);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Boolean> deleteStudentAcademicBackground(@PathVariable String id) {
        boolean deleted = studentAcademicBackgroundService.deleteStudentAcademicBackground(id);
        if (deleted) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}