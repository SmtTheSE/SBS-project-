package com.SBS_StudentServing_System.dto.academic;

import lombok.Data;

@Data
public class StudentEnrollmentDto {
    private Long id;
    private String studentId;
    private String studyPlanCourseId;
    private Integer enrollmentStatus;
    private String completionStatus;
    private Boolean exemptionStatus;
}
