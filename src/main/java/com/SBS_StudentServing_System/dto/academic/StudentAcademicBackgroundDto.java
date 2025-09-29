package com.SBS_StudentServing_System.dto.academic;

import lombok.Data;

@Data
public class StudentAcademicBackgroundDto {
    private String backgroundId;
    private String studentId;
    private String highestQualification;
    private String institutionName;
    private String englishQualification;
    private Float englishScore;
    private Boolean requiredForPlacementTest;
    private String documentUrl;
}
