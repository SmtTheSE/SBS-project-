package com.SBS_StudentServing_System.dto.academic;

import lombok.Data;

@Data
public class LecturerCourseDto {
    private Long id;
    private String lecturerId;
    private String studyPlanCourseId;
    private String semesterId;
    private String classScheduleId;
    private Integer totalAssignedCourse;
}
