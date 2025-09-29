package com.SBS_StudentServing_System.model.academic;

import com.SBS_StudentServing_System.model.lecturer.Lecturer;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fact_lecturerCourse")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LecturerCourse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "lecturer_id", nullable = false)
    private Lecturer lecturer;

    @ManyToOne
    @JoinColumn(name = "study_plan_course_id", nullable = false)
    private StudyPlanCourse studyPlanCourse;

    @ManyToOne
    @JoinColumn(name = "semester_id", nullable = false)
    private Semester semester;

    @ManyToOne
    @JoinColumn(name = "class_schedule_id", nullable = false)
    private ClassSchedule classSchedule;

    @Column(name = "totalAssignedCourse", nullable = false)
    private Integer totalAssignedCourse = 0;
}