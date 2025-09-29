package com.SBS_StudentServing_System.controller.student;

import com.SBS_StudentServing_System.dto.studentinfo.HealthInsuranceDto;
import com.SBS_StudentServing_System.service.studentinfo.HealthInsuranceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/health-insurances")
public class HealthInsuranceController {

    @Autowired
    private HealthInsuranceService healthInsuranceService;

    @GetMapping
    public List<HealthInsuranceDto> getAll() {
        return healthInsuranceService.getAll();
    }

    @GetMapping("/student/{studentId}")
    public List<HealthInsuranceDto> getByStudentId(@PathVariable String studentId) {
        return healthInsuranceService.getByStudentId(studentId);
    }

    @PostMapping
    public ResponseEntity<HealthInsuranceDto> create(@RequestBody HealthInsuranceDto dto) {
        return ResponseEntity.ok(healthInsuranceService.save(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HealthInsuranceDto> update(@PathVariable String id, @RequestBody HealthInsuranceDto dto) {
        dto.setHealthInsuranceId(id);
        return ResponseEntity.ok(healthInsuranceService.save(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        healthInsuranceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
