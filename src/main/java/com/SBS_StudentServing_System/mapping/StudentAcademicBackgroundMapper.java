package com.SBS_StudentServing_System.mapping;

import com.SBS_StudentServing_System.dto.academic.StudentAcademicBackgroundDto;
import com.SBS_StudentServing_System.model.academic.StudentAcademicBackground;
import com.SBS_StudentServing_System.model.student.Student;

public class StudentAcademicBackgroundMapper {
    public static StudentAcademicBackgroundDto toDto(StudentAcademicBackground entity) {
        StudentAcademicBackgroundDto dto = new StudentAcademicBackgroundDto();
        dto.setBackgroundId(entity.getBackgroundId());
        dto.setStudentId(entity.getStudent() != null ? entity.getStudent().getStudentId() : null);
        dto.setHighestQualification(entity.getHighestQualification());
        dto.setInstitutionName(entity.getInstitutionName());
        dto.setEnglishQualification(entity.getEnglishQualification());
        dto.setEnglishScore(entity.getEnglishScore());
        dto.setRequiredForPlacementTest(entity.getRequiredForPlacementTest());
        dto.setDocumentUrl(entity.getDocumentUrl());
        return dto;
    }

    public static StudentAcademicBackground toEntity(StudentAcademicBackgroundDto dto, Student student) {
        return StudentAcademicBackground.builder()
                .backgroundId(dto.getBackgroundId())
                .student(student)
                .highestQualification(dto.getHighestQualification())
                .institutionName(dto.getInstitutionName())
                .englishQualification(dto.getEnglishQualification())
                .englishScore(dto.getEnglishScore())
                .requiredForPlacementTest(dto.getRequiredForPlacementTest())
                .documentUrl(dto.getDocumentUrl())
                .build();
    }
}
