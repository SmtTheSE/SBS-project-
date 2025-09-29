package com.SBS_StudentServing_System.model.academic;

import com.SBS_StudentServing_System.model.student.Student;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fact_studentenrollment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentEnrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Not in schema, but needed for JPA

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "study_plan_course_id", nullable = false)
    private StudyPlanCourse studyPlanCourse;

    @Column(name = "enrollment_status", nullable = false)
    private Integer enrollmentStatus = 1; // 0 = Not Qualified, 1 = Qualified

    @Column(name = "completion_status", nullable = false, length = 20)
    private String completionStatus;

    @Column(name = "exemption_status", nullable = false)
    private Boolean exemptionStatus = false;
}