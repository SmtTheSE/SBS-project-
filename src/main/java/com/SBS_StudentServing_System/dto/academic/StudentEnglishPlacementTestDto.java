package com.SBS_StudentServing_System.dto.academic;

import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentEnglishPlacementTestDto {
    private String testId;
    private String studentId;
    private LocalDate testDate;
    private String resultLevel;
    private Integer resultStatus;
}
