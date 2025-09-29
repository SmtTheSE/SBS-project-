package com.SBS_StudentServing_System.model.academic;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "dim_transcriptRequest")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TranscriptRequest {

    @Id
    @Column(name = "request_id", length = 15)
    private String requestId;

    @Column(name = "request_date", nullable = false)
    private LocalDate requestDate;

    @Column(name = "transcript_type", nullable = false)
    private Integer transcriptType; // 0 = Unofficial, 1 = Official
}

