package com.SBS_StudentServing_System.dto.admin;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TransferProgramDto {
    private String transferProgramId;
    private String adminId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String transferCountry;
    private String partnerInstitutionId;
    private String partnerInstitutionName;
}