package com.SBS_StudentServing_System.mapping;


import com.SBS_StudentServing_System.dto.academic.StudentEnglishPlacementTestDto;
import com.SBS_StudentServing_System.model.academic.StudentEnglishPlacementTest;
import com.SBS_StudentServing_System.model.student.Student;

public class StudentEnglishPlacementTestMapper {
    public static StudentEnglishPlacementTestDto toDto(StudentEnglishPlacementTest entity) {
        StudentEnglishPlacementTestDto dto = new StudentEnglishPlacementTestDto();
        dto.setTestId(entity.getTestId());
        dto.setStudentId(entity.getStudent() != null ? entity.getStudent().getStudentId() : null);
        dto.setTestDate(entity.getTestDate());
        dto.setResultLevel(entity.getResultLevel());
        dto.setResultStatus(entity.getResultStatus());
        return dto;
    }

    public static StudentEnglishPlacementTest toEntity(StudentEnglishPlacementTestDto dto, Student student) {
        return StudentEnglishPlacementTest.builder()
                .testId(dto.getTestId())
                .student(student)
                .testDate(dto.getTestDate())
                .resultLevel(dto.getResultLevel())
                .resultStatus(dto.getResultStatus())
                .build();
    }
}
