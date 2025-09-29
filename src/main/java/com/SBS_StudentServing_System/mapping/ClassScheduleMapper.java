package com.SBS_StudentServing_System.mapping;

import com.SBS_StudentServing_System.dto.academic.ClassScheduleDto;
import com.SBS_StudentServing_System.model.academic.ClassSchedule;
import com.SBS_StudentServing_System.model.academic.StudyPlanCourse;

public class ClassScheduleMapper {
    public static ClassScheduleDto toDto(ClassSchedule entity) {
        ClassScheduleDto dto = new ClassScheduleDto();
        dto.setClassScheduleId(entity.getClassScheduleId());
        dto.setStudyPlanCourseId(entity.getStudyPlanCourse() != null ? entity.getStudyPlanCourse().getStudyPlanCourseId() : null);
        dto.setDayOfWeek(entity.getDayOfWeek());
        dto.setStartTime(entity.getStartTime());
        dto.setEndTime(entity.getEndTime());
        dto.setDurationMinutes(entity.getDurationMinutes());
        dto.setRoom(entity.getRoom());
        return dto;
    }

    public static ClassSchedule toEntity(ClassScheduleDto dto, StudyPlanCourse studyPlanCourse) {
        return ClassSchedule.builder()
                .classScheduleId(dto.getClassScheduleId())
                .studyPlanCourse(studyPlanCourse)
                .dayOfWeek(dto.getDayOfWeek())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .durationMinutes(dto.getDurationMinutes())
                .room(dto.getRoom())
                .build();
    }
}
