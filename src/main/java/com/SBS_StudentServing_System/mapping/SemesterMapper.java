package com.SBS_StudentServing_System.mapping;


import com.SBS_StudentServing_System.dto.academic.SemesterDto;
import com.SBS_StudentServing_System.model.academic.Semester;

public class SemesterMapper {
    public static SemesterDto toDto(Semester entity) {
        SemesterDto dto = new SemesterDto();
        dto.setSemesterId(entity.getSemesterId());
        dto.setYear(entity.getYear());
        dto.setIntakeMonth(entity.getIntakeMonth());
        dto.setTerm(entity.getTerm());
        return dto;
    }

    public static Semester toEntity(SemesterDto dto) {
        return Semester.builder()
                .semesterId(dto.getSemesterId())
                .year(dto.getYear())
                .intakeMonth(dto.getIntakeMonth())
                .term(dto.getTerm())
                .build();
    }
}
