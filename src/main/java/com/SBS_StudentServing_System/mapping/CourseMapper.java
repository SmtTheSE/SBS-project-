package com.SBS_StudentServing_System.mapping;

import com.SBS_StudentServing_System.dto.academic.CourseDto;
import com.SBS_StudentServing_System.model.academic.Course;
import com.SBS_StudentServing_System.model.lecturer.Lecturer;

public class CourseMapper {
    public static CourseDto toDto(Course entity) {
        CourseDto dto = new CourseDto();
        dto.setCourseId(entity.getCourseId());
        dto.setCourseName(entity.getCourseName());
        dto.setCreditScore(entity.getCreditScore());
        dto.setLecturerId(entity.getLecturer() != null ? entity.getLecturer().getLecturerId() : null);
        return dto;
    }

    public static Course toEntity(CourseDto dto, Lecturer lecturer) {
        return Course.builder()
                .courseId(dto.getCourseId())
                .courseName(dto.getCourseName())
                .creditScore(dto.getCreditScore())
                .lecturer(lecturer)
                .build();
    }
}
