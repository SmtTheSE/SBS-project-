package com.SBS_StudentServing_System.service.academic;

import com.SBS_StudentServing_System.model.academic.TranscriptIssueRequest;
import com.SBS_StudentServing_System.model.academic.TranscriptRequest;
import com.SBS_StudentServing_System.model.student.Student;
import com.SBS_StudentServing_System.repository.academic.TranscriptRequestRepository;
import com.SBS_StudentServing_System.repository.academic.Transcript_Issue_Repository;
import com.SBS_StudentServing_System.repository.student.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class TranscriptRequestService {

    @Autowired
    private TranscriptRequestRepository transcriptRequestRepository;

    @Autowired
    private Transcript_Issue_Repository transcriptIssueRepository;

    @Autowired
    private StudentRepository studentRepository;

    public TranscriptIssueRequest createTranscriptRequest(String studentId, Integer transcriptType, String optionalMessage) {
        // Create transcript request
        TranscriptRequest transcriptRequest = TranscriptRequest.builder()
                .requestId("TR" + UUID.randomUUID().toString().substring(0, 13).toUpperCase())
                .requestDate(LocalDate.now())
                .transcriptType(transcriptType)
                .build();
        
        transcriptRequestRepository.save(transcriptRequest);

        // Get student
        Student student = studentRepository.findById(studentId).orElseThrow(() -> 
            new RuntimeException("Student not found with ID: " + studentId));

        // Create transcript issue request
        TranscriptIssueRequest issueRequest = TranscriptIssueRequest.builder()
                .student(student)
                .request(transcriptRequest)
                .requestStatus("Pending")
                .optionalMessage(optionalMessage)
                .build();

        return transcriptIssueRepository.save(issueRequest);
    }

    public List<TranscriptIssueRequest> getAllTranscriptRequests() {
        return transcriptIssueRepository.findAll();
    }

    public TranscriptIssueRequest updateTranscriptRequestStatus(Long requestId, String status, String adminId) {
        TranscriptIssueRequest request = transcriptIssueRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Transcript request not found with ID: " + requestId));
        
        request.setRequestStatus(status);
        if ("Issued".equals(status)) {
            request.setIssuedDate(LocalDate.now());
        }
        
        // In a real implementation, you would also set the admin who processed the request
        // request.setAdmin(adminRepository.findById(adminId).orElse(null));
        
        return transcriptIssueRepository.save(request);
    }
}