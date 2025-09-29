package com.SBS_StudentServing_System.dto.academic;

import lombok.Data;

import java.time.LocalDate;


@Data
public class Transcript_Issue_RequestDto {
    private Long id;
    private String studentId;
    private String requestId;
    private LocalDate issuedDate;
    private String adminId;
    private String requestStatus;
    private String optionalMessage;
}
