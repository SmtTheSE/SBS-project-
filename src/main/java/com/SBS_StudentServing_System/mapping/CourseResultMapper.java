package com.SBS_StudentServing_System.mapping;

import com.SBS_StudentServing_System.dto.academic.CourseResultDto;
import com.SBS_StudentServing_System.model.academic.CourseResult;
import com.SBS_StudentServing_System.model.academic.Grade;
import com.SBS_StudentServing_System.model.academic.StudyPlanCourse;
import com.SBS_StudentServing_System.model.student.Student;

public class CourseResultMapper {
    public static CourseResultDto toDto(CourseResult entity) {
        CourseResultDto dto = new CourseResultDto();
        dto.setId(entity.getId());
        dto.setStudentId(entity.getStudent() != null ? entity.getStudent().getStudentId() : null);
        dto.setStudyPlanCourseId(entity.getStudyPlanCourse() != null ? entity.getStudyPlanCourse().getStudyPlanCourseId() : null);
        dto.setGradeName(entity.getGrade() != null ? entity.getGrade().getGradeName() : null);
        dto.setCreditsEarned(entity.getCreditsEarned());
        return dto;
    }

    public static CourseResult toEntity(CourseResultDto dto, Student student, StudyPlanCourse studyPlanCourse, Grade grade) {
        return CourseResult.builder()
                .id(dto.getId())
                .student(student)
                .studyPlanCourse(studyPlanCourse)
                .grade(grade)
                .creditsEarned(dto.getCreditsEarned())
                .build();
    }
}
