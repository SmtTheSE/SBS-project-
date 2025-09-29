package com.SBS_StudentServing_System.mapping;

import com.SBS_StudentServing_System.dto.academic.AttendanceSummaryDto;
import com.SBS_StudentServing_System.model.academic.AttendanceSummary;
import com.SBS_StudentServing_System.model.academic.StudyPlanCourse;
import com.SBS_StudentServing_System.model.student.Student;

public class AttendanceSummaryMapper {
    public static AttendanceSummaryDto toDto(AttendanceSummary entity) {
        AttendanceSummaryDto dto = new AttendanceSummaryDto();
        dto.setId(entity.getId());
        dto.setStudentId(entity.getStudent() != null ? entity.getStudent().getStudentId() : null);
        dto.setStudyPlanCourseId(entity.getStudyPlanCourse() != null ? entity.getStudyPlanCourse().getStudyPlanCourseId() : null);
        dto.setPresentDays(entity.getPresentDays());
        dto.setTotalDays(entity.getTotalDays());
        dto.setAbsentDays(entity.getAbsentDays());
        dto.setTotalAttendancePercentage(entity.getTotalAttendancePercentage());
        dto.setFlagLevel(entity.getFlagLevel());
        return dto;
    }

    public static AttendanceSummary toEntity(AttendanceSummaryDto dto, Student student, StudyPlanCourse studyPlanCourse) {
        return AttendanceSummary.builder()
                .id(dto.getId())
                .student(student)
                .studyPlanCourse(studyPlanCourse)
                .presentDays(dto.getPresentDays())
                .totalDays(dto.getTotalDays())
                .absentDays(dto.getAbsentDays())
                .totalAttendancePercentage(dto.getTotalAttendancePercentage())
                .flagLevel(dto.getFlagLevel())
                .build();
    }
}
