package com.SBS_StudentServing_System.dto.studentinfo;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;


@Getter
@Setter
public class VisaExtensionRequestDto {
    private String extensionRequestId;
    private String visaPassportId;
    private String studentId;
    private String adminId;
    private LocalDate requestDate;
    private LocalDate requestedExtensionUntil;
    private int status; // 0 = Pending, 1 = Approved, 2 = Rejected
    private String notes;
}
