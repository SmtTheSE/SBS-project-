package com.SBS_StudentServing_System.model.academic;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "dim_studyPlanCourse")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyPlanCourse {
    @Id
    @Column(name = "study_plan_course_id", length = 15)
    private String studyPlanCourseId;

    @Column(name = "study_plan_id", nullable = false, length = 20)
    private String studyPlanId;

    @Column(name = "course_id", nullable = false, length = 20)
    private String courseId;

    @Column(name = "semester_id", nullable = false, length = 10)
    private String semesterId;

    @Column(name = "assignment_deadline")
    private LocalDate assignmentDeadline;
}