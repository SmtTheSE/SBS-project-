package com.SBS_StudentServing_System.mapping;

import com.SBS_StudentServing_System.dto.academic.StudyPlanCourseDto;
import com.SBS_StudentServing_System.model.academic.StudyPlanCourse;

public class StudyPlanCourseMapper {
    public static StudyPlanCourseDto toDto(StudyPlanCourse entity) {
        StudyPlanCourseDto dto = new StudyPlanCourseDto();
        dto.setStudyPlanCourseId(entity.getStudyPlanCourseId());
        dto.setStudyPlanId(entity.getStudyPlanId());
        dto.setCourseId(entity.getCourseId());
        dto.setSemesterId(entity.getSemesterId());
        dto.setAssignmentDeadline(entity.getAssignmentDeadline());
        return dto;
    }

    public static StudyPlanCourse toEntity(StudyPlanCourseDto dto) {
        StudyPlanCourse entity = new StudyPlanCourse();
        entity.setStudyPlanCourseId(dto.getStudyPlanCourseId());
        entity.setStudyPlanId(dto.getStudyPlanId());
        entity.setCourseId(dto.getCourseId());
        entity.setSemesterId(dto.getSemesterId());
        entity.setAssignmentDeadline(dto.getAssignmentDeadline());
        return entity;
    }
}