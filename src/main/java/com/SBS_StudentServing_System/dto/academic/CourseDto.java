package com.SBS_StudentServing_System.dto.academic;

import lombok.Data;

@Data
public class CourseDto {
    private String courseId;
    private String courseName;
    private Integer creditScore;
    private String lecturerId;
}
