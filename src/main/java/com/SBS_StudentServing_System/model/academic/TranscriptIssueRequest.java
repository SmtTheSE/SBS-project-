package com.SBS_StudentServing_System.model.academic;

import com.SBS_StudentServing_System.model.admin.Admin;
import com.SBS_StudentServing_System.model.student.Student;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "fact_transcript_issue_Request")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TranscriptIssueRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "request_id", nullable = false)
    private TranscriptRequest request;

    @Column(name = "issued_date")
    private LocalDate issuedDate;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;

    @Column(name = "request_status", nullable = false, length = 50)
    private String requestStatus;

    @Column(name = "optional_message", length = 255)
    private String optionalMessage;
}

