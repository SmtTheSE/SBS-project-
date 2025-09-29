package com.SBS_StudentServing_System.model.studentinfo;

import com.SBS_StudentServing_System.model.student.Student;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "dim_visaPassport")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisaPassport {
    @Id
    @Column(name = "visaPassport_id", length = 15)
    private String visaPassportId;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "visa_id", length = 50, nullable = false)
    private String visaId;

    private LocalDate visaIssuedDate;
    private LocalDate visaExpiredDate;

    @Column(name = "visaType")
    private Integer visaType;

    @Column(name = "passportNumber", length = 50)
    private String passportNumber;

    private LocalDate passportIssuedDate;
    private LocalDate passportExpiredDate;
}