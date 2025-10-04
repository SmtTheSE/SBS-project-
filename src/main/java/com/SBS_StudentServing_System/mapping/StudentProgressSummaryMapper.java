package com.SBS_StudentServing_System.mapping;

import com.SBS_StudentServing_System.dto.academic.StudentProgressSummaryDto;
import com.SBS_StudentServing_System.model.academic.StudentProgressSummary;
import com.SBS_StudentServing_System.model.student.Student;

public class StudentProgressSummaryMapper {
    public static StudentProgressSummaryDto toDto(StudentProgressSummary entity) {
        StudentProgressSummaryDto dto = new StudentProgressSummaryDto();
        dto.setId(entity.getId());
        
        // 安全地处理Student关联
        if (entity.getStudent() != null) {
            dto.setStudentId(entity.getStudent().getStudentId());
        } else {
            dto.setStudentId(null);
        }
        
        // 直接使用studyPlanId字符串字段
        dto.setStudyPlanId(entity.getStudyPlanId());
        
        dto.setTotalEnrolledCourse(entity.getTotalEnrolledCourse());
        dto.setTotalCompletedCourse(entity.getTotalCompletedCourse());
        dto.setTotalCreditsEarned(entity.getTotalCreditsEarned());
        return dto;
    }

    public static StudentProgressSummary toEntity(StudentProgressSummaryDto dto, Student student) {
        StudentProgressSummary entity = new StudentProgressSummary();
        entity.setId(dto.getId());
        entity.setStudent(student);
        entity.setStudyPlanId(dto.getStudyPlanId());
        entity.setTotalEnrolledCourse(dto.getTotalEnrolledCourse() != null ? dto.getTotalEnrolledCourse() : 0);
        entity.setTotalCompletedCourse(dto.getTotalCompletedCourse() != null ? dto.getTotalCompletedCourse() : 0);
        entity.setTotalCreditsEarned(dto.getTotalCreditsEarned() != null ? dto.getTotalCreditsEarned() : 0);
        return entity;
    }
}