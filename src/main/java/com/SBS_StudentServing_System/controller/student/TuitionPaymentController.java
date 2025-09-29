package com.SBS_StudentServing_System.controller.student;


import com.SBS_StudentServing_System.dto.studentinfo.TuitionPaymentDto;
import com.SBS_StudentServing_System.service.studentinfo.TuitionPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tuition-payments")
public class TuitionPaymentController {

    @Autowired
    private TuitionPaymentService tuitionPaymentService;

    @GetMapping
    public List<TuitionPaymentDto> getAll() {
        return tuitionPaymentService.getAll();
    }

    @GetMapping("/student/{studentId}")
    public List<TuitionPaymentDto> getByStudentId(@PathVariable String studentId) {
        return tuitionPaymentService.getByStudentId(studentId);
    }

    @PostMapping
    public ResponseEntity<TuitionPaymentDto> create(@RequestBody TuitionPaymentDto dto) {
        return ResponseEntity.ok(tuitionPaymentService.save(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TuitionPaymentDto> update(@PathVariable Long id, @RequestBody TuitionPaymentDto dto) {
        // If your DTO has 'id', set it here: dto.setId(id);
        return ResponseEntity.ok(tuitionPaymentService.save(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tuitionPaymentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
