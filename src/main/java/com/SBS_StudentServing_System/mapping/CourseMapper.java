package com.SBS_StudentServing_System.mapping;

import com.SBS_StudentServing_System.dto.academic.CourseDto;
import com.SBS_StudentServing_System.dto.academic.LecturerDto;
import com.SBS_StudentServing_System.model.academic.Course;
import com.SBS_StudentServing_System.model.lecturer.Lecturer;

public class CourseMapper {
    public static CourseDto toDto(Course entity) {
        CourseDto dto = new CourseDto();
        dto.setCourseId(entity.getCourseId());
        dto.setCourseName(entity.getCourseName());
        dto.setCreditScore(entity.getCreditScore());
        dto.setLecturerId(entity.getLecturer() != null ? entity.getLecturer().getLecturerId() : null);
        
        // Map lecturer information
        if (entity.getLecturer() != null) {
            LecturerDto lecturerDto = new LecturerDto();
            lecturerDto.setLecturerId(entity.getLecturer().getLecturerId());
            lecturerDto.setName(entity.getLecturer().getName());
            lecturerDto.setDateOfBirth(entity.getLecturer().getDateOfBirth());
            lecturerDto.setTeachingExperience(entity.getLecturer().getTeachingExperience());
            lecturerDto.setAcademicTitle(entity.getLecturer().getAcademicTitle());
            
            // Map department information if department exists
            if (entity.getLecturer().getDepartment() != null) {
                lecturerDto.setDepartmentId(entity.getLecturer().getDepartment().getDepartmentId());
                lecturerDto.setDepartmentName(entity.getLecturer().getDepartment().getDepartmentName());
            }
            
            dto.setLecturer(lecturerDto);
        }
        
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