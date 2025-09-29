package com.SBS_StudentServing_System.model.academic;

import com.SBS_StudentServing_System.model.student.Student;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fact_attendanceSummary")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceSummary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "study_plan_course_id", nullable = false)
    private StudyPlanCourse studyPlanCourse;

    @Column(name = "present_days", nullable = false)
    private Integer presentDays = 0;

    @Column(name = "total_days", nullable = false)
    private Integer totalDays = 0;

    @Column(name = "absent_days", nullable = false)
    private Integer absentDays = 0;

    @Column(name = "totalAttendance_percentage", nullable = false)
    private Integer totalAttendancePercentage = 0; // 0-100

    @Column(name = "flag_level", length = 20)
    private String flagLevel;
}