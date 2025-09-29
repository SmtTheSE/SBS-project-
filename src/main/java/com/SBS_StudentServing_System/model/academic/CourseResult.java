package com.SBS_StudentServing_System.model.academic;

import com.SBS_StudentServing_System.model.student.Student;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fact_courseResult")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "study_plan_course_id", nullable = false)
    private StudyPlanCourse studyPlanCourse;

    @ManyToOne
    @JoinColumn(name = "grade_name", nullable = false)
    private Grade grade;

    @Column(name = "credits_earned", nullable = false)
    private Integer creditsEarned = 0;
}