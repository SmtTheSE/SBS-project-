package com.SBS_StudentServing_System.model.academic;

import com.SBS_StudentServing_System.model.student.Student;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fact_studentProgressSummary")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProgressSummary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "study_plan_id", nullable = false)
    private StudyPlan studyPlan;

    @Column(name = "total_enrolled_course", nullable = false)
    private Integer totalEnrolledCourse = 0;

    @Column(name = "total_completed_course", nullable = false)
    private Integer totalCompletedCourse = 0;


    @Column(name = "total_credits_earned", nullable = false)
    private Integer totalCreditsEarned = 0;
}