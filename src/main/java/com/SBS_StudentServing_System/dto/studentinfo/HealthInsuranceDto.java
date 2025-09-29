package com.SBS_StudentServing_System.dto.studentinfo;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;


@Getter
@Setter
public class HealthInsuranceDto {
    private String healthInsuranceId;
    private String studentId;
    private String adminId;
    private String insuranceNumber;
    private LocalDate validFrom;
    private LocalDate validUntil;
    private String filePath;
    private String optionalMessage;
}
