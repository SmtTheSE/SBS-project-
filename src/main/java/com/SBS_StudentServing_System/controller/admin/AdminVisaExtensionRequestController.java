package com.SBS_StudentServing_System.controller.admin;

import com.SBS_StudentServing_System.dto.studentinfo.VisaExtensionRequestDto;
import com.SBS_StudentServing_System.service.studentinfo.VisaExtensionRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/visa-extension-requests")
public class AdminVisaExtensionRequestController {

    @Autowired
    private VisaExtensionRequestService visaExtensionRequestService;

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingRequests() {
        try {
            List<VisaExtensionRequestDto> requests = visaExtensionRequestService.getPendingRequests();
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching pending requests: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<VisaExtensionRequestDto> requests = visaExtensionRequestService.getAll();
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching requests: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            VisaExtensionRequestDto request = visaExtensionRequestService.getById(id);
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching request: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody VisaExtensionRequestDto dto) {
        try {
            dto.setExtensionRequestId(id);
            VisaExtensionRequestDto updatedDto = visaExtensionRequestService.save(dto);
            return ResponseEntity.ok(updatedDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating request: " + e.getMessage());
        }
    }
    
    // New endpoint to get requests by student ID
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getByStudentId(@PathVariable String studentId) {
        try {
            List<VisaExtensionRequestDto> requests = visaExtensionRequestService.getByStudentId(studentId);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching requests for student: " + e.getMessage());
        }
    }
}