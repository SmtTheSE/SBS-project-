package com.SBS_StudentServing_System.model.academic;

import com.SBS_StudentServing_System.model.student.Student;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Entity
@Table(name = "dim_studentEnglishPlacementTest")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentEnglishPlacementTest {
    @Id
    @Column(name = "test_id", length = 15)
    private String testId;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "test_date", nullable = false)
    private LocalDate testDate;

    @Column(name = "result_level", nullable = false, length = 50)
    private String resultLevel;

    @Column(name = "result_status", nullable = false)
    private Integer resultStatus; // 0 = Fail, 1 = Pass
}