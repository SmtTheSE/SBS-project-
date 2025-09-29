package com.SBS_StudentServing_System.dto.academic;

import lombok.Data;

@Data
public class CourseResultDto {
    private Long id;
    private String studentId;
    private String studyPlanCourseId;
    private String gradeName;
    private Integer creditsEarned;
}
