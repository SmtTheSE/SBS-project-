package com.SBS_StudentServing_System.dto.academic;

import lombok.Data;

@Data
public class AttendanceSummaryDto {
    private Long id;
    private String studentId;
    private String studyPlanCourseId;
    private Integer presentDays;
    private Integer totalDays;
    private Integer absentDays;
    private Integer totalAttendancePercentage;
    private String flagLevel;
}
