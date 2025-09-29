package com.SBS_StudentServing_System.dto.academic;

import lombok.Data;

import java.time.LocalDate;

@Data
public class TranscriptRequestDto {
    private String requestId;
    private LocalDate requestDate;
    private Integer transcriptType;
}
