package com.SBS_StudentServing_System.mapping;

import com.SBS_StudentServing_System.dto.academic.TranscriptRequestDto;
import com.SBS_StudentServing_System.model.academic.TranscriptRequest;

public class TranscriptRequestMapper {
    public static TranscriptRequestDto toDto(TranscriptRequest entity) {
        TranscriptRequestDto dto = new TranscriptRequestDto();
        dto.setRequestId(entity.getRequestId());
        dto.setRequestDate(entity.getRequestDate());
        dto.setTranscriptType(entity.getTranscriptType());
        return dto;
    }

    public static TranscriptRequest toEntity(TranscriptRequestDto dto) {
        return TranscriptRequest.builder()
                .requestId(dto.getRequestId())
                .requestDate(dto.getRequestDate())
                .transcriptType(dto.getTranscriptType())
                .build();
    }
}
