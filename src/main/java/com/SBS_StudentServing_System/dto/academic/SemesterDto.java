package com.SBS_StudentServing_System.dto.academic;

import lombok.Data;

import java.time.LocalDate;

@Data
public class SemesterDto {
    private String semesterId;
    private LocalDate year;
    private String intakeMonth;
    private String term;
}
