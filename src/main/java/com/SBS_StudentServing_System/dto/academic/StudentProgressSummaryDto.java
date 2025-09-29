package com.SBS_StudentServing_System.dto.academic;

import lombok.Data;

@Data
public class StudentProgressSummaryDto {
    private Long id;
    private String studentId;
    private String studyPlanId;
    private Integer totalEnrolledCourse;
    private Integer totalCompletedCourse;
    private Integer totalCreditsEarned;
}
