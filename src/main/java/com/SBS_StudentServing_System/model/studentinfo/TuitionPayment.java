package com.SBS_StudentServing_System.model.studentinfo;

import com.SBS_StudentServing_System.model.student.Student;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fact_tuitionpayment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TuitionPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Assuming you’ll want primary key for JPA

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "scholarship_id")
    private Scholarship scholarship;

    private Integer paymentStatus;
    private Integer paymentMethod;
    private Float amountPaid;
}
