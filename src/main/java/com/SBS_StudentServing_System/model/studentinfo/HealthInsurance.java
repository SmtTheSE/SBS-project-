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
@Table(name = "fact_healthinsurance")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthInsurance {
    @Id
    @Column(name = "health_insurance_id", length = 15)
    private String healthInsuranceId;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private Admin admin;

    private String insuranceNumber;
    private LocalDate validFrom;
    private LocalDate validUntil;
    private String filePath;
    private String optionalMessage;
}
