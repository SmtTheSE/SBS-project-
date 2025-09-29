package com.SBS_StudentServing_System.controller.student;

import com.SBS_StudentServing_System.dto.studentinfo.VisaPassportDto;
import com.SBS_StudentServing_System.service.studentinfo.VisaPassportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visa-passports")
public class VisaPassportController {

    @Autowired
    private VisaPassportService visaPassportService;

    @GetMapping
    public List<VisaPassportDto> getAll() {
        return visaPassportService.getAllVisaPassports();
    }

    @GetMapping("/student/{studentId}")
    public List<VisaPassportDto> getByStudentId(@PathVariable String studentId) {
        return visaPassportService.getVisaPassportsByStudentId(studentId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VisaPassportDto> getById(@PathVariable String id) {
        VisaPassportDto dto = visaPassportService.getById(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<VisaPassportDto> create(@RequestBody VisaPassportDto dto) {
        return ResponseEntity.ok(visaPassportService.save(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VisaPassportDto> update(@PathVariable String id, @RequestBody VisaPassportDto dto) {
        dto.setVisaPassportId(id);
        return ResponseEntity.ok(visaPassportService.save(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        visaPassportService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
