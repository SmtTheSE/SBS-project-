package com.SBS_StudentServing_System.mapping;

import com.SBS_StudentServing_System.dto.academic.GradeDto;
import com.SBS_StudentServing_System.model.academic.Grade;

public class GradeMapper {
    public static GradeDto toDto(Grade entity) {
        GradeDto dto = new GradeDto();
        dto.setGradeName(entity.getGradeName());
        dto.setDescription(entity.getDescription());
        return dto;
    }

    public static Grade toEntity(GradeDto dto) {
        return Grade.builder()
                .gradeName(dto.getGradeName())
                .description(dto.getDescription())
                .build();
    }
}
