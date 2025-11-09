package com.SBS_StudentServing_System.controller.academic;

import com.SBS_StudentServing_System.model.academic.TranscriptIssueRequest;
import com.SBS_StudentServing_System.service.academic.TranscriptRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/academic/transcript-requests")
public class TranscriptRequestController {

    @Autowired
    private TranscriptRequestService transcriptRequestService;

    @PostMapping("/submit")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> submitTranscriptRequest(
            @RequestParam String studentId,
            @RequestParam Integer transcriptType,
            @RequestParam(required = false) String optionalMessage) {
        
        Map<String, Object> response = new HashMap<>();
        try {
            TranscriptIssueRequest request = transcriptRequestService.createTranscriptRequest(
                    studentId, transcriptType, optionalMessage);
            
            response.put("success", true);
            response.put("message", "Transcript request submitted successfully");
            response.put("data", request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error submitting transcript request: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAllTranscriptRequests() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<TranscriptIssueRequest> requests = transcriptRequestService.getAllTranscriptRequests();
            
            response.put("success", true);
            response.put("data", requests);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error retrieving transcript requests: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/{requestId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> updateTranscriptRequestStatus(
            @PathVariable Long requestId,
            @RequestParam String status,
            @RequestParam(required = false) String adminId) {
        
        Map<String, Object> response = new HashMap<>();
        try {
            TranscriptIssueRequest request = transcriptRequestService.updateTranscriptRequestStatus(
                    requestId, status, adminId);
            
            response.put("success", true);
            response.put("message", "Transcript request status updated successfully");
            response.put("data", request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error updating transcript request status: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}