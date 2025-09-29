package com.SBS_StudentServing_System.controller.student;

import com.SBS_StudentServing_System.dto.studentinfo.DimScholarshipDto;
import com.SBS_StudentServing_System.service.studentinfo.DimScholarshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scholarships")
public class DimScholarshipController {

    @Autowired
    private DimScholarshipService scholarshipService;

    @GetMapping
    public List<DimScholarshipDto> getAll() {
        return scholarshipService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DimScholarshipDto> getById(@PathVariable String id) {
        DimScholarshipDto dto = scholarshipService.getById(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<DimScholarshipDto> create(@RequestBody DimScholarshipDto dto) {
        return ResponseEntity.ok(scholarshipService.save(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DimScholarshipDto> update(@PathVariable String id, @RequestBody DimScholarshipDto dto) {
        dto.setScholarshipId(id);
        return ResponseEntity.ok(scholarshipService.save(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        scholarshipService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
