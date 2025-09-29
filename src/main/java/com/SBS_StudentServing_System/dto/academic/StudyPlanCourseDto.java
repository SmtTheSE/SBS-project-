package com.SBS_StudentServing_System.dto.academic;

import lombok.Data;

import java.time.LocalDate;

@Data
public class StudyPlanCourseDto {
    private String studyPlanCourseId;
    private String studyPlanId;
    private String courseId;
    private String courseName;
    private String semesterId;
    private LocalDate assignmentDeadline;
}
