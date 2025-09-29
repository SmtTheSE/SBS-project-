package com.SBS_StudentServing_System.model.studentinfo;

import com.SBS_StudentServing_System.model.student.Student;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fact_studentScholarship")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentScholarship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "Scholarship_id", nullable = false)
    private Scholarship scholarship;

    @Column(name = "scholarshipPercentage")
    private Integer scholarshipPercentage;
}