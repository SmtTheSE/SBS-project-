package com.SBS_StudentServing_System.controller.admin;

import com.SBS_StudentServing_System.dto.studentinfo.StudentScholarshipDto;
import com.SBS_StudentServing_System.service.studentinfo.StudentScholarshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/student-scholarships")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminStudentScholarshipController {

    @Autowired
    private StudentScholarshipService studentScholarshipService;

    @GetMapping
    public List<StudentScholarshipDto> getAll() {
        return studentScholarshipService.getAll();
    }

    @GetMapping("/student/{studentId}")
    public List<StudentScholarshipDto> getByStudentId(@PathVariable String studentId) {
        return studentScholarshipService.getByStudentId(studentId);
    }

    @PostMapping
    public ResponseEntity<StudentScholarshipDto> create(@RequestBody StudentScholarshipDto dto) {
        return ResponseEntity.ok(studentScholarshipService.save(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentScholarshipDto> update(@PathVariable Long id, @RequestBody StudentScholarshipDto dto) {
        dto.setId(id); // Set the ID for update
        return ResponseEntity.ok(studentScholarshipService.save(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        studentScholarshipService.delete(id);
        return ResponseEntity.noContent().build();
    }
}