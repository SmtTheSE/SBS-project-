package com.SBS_StudentServing_System.mapping;

import com.SBS_StudentServing_System.dto.academic.StudyPlanDto;
import com.SBS_StudentServing_System.model.academic.StudyPlan;

public class StudyPlanMapper {
    public static StudyPlanDto toDto(StudyPlan entity) {
        StudyPlanDto dto = new StudyPlanDto();
        dto.setStudyPlanId(entity.getStudyPlanId());
        dto.setPathwayName(entity.getPathwayName());
        dto.setTotalCreditPoint(entity.getTotalCreditPoint());
        dto.setMajorName(entity.getMajorName());
        return dto;
    }

    public static StudyPlan toEntity(StudyPlanDto dto) {
        return StudyPlan.builder()
                .studyPlanId(dto.getStudyPlanId())
                .pathwayName(dto.getPathwayName())
                .totalCreditPoint(dto.getTotalCreditPoint())
                .majorName(dto.getMajorName())
                .build();
    }
}