package com.SBS_StudentServing_System.model.studentinfo;

import com.SBS_StudentServing_System.model.admin.Admin;
import com.SBS_StudentServing_System.model.student.Student;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "fact_visaExtensionRequest")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisaExtensionRequest {
    @Id
    @Column(name = "extensionRequest_id", length = 50)
    private String extensionRequestId;

    @ManyToOne
    @JoinColumn(name = "visaPassport_id", nullable = false)
    private VisaPassport visaPassport;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private Admin admin;

    private LocalDate requestDate;
    private LocalDate requestedExtensionUntil;
    private Integer status;
    private String notes;
}