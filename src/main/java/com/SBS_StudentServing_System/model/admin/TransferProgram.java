package com.SBS_StudentServing_System.model.admin;

import com.SBS_StudentServing_System.model.studentinfo.PartnerInstitution;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "dim_transferProgram")
@Getter
@Setter
@Builder
public class TransferProgram {
    @Id
    @Column(name = "transferProgram_id", length = 15)
    private String transferProgramId;

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private Admin admin;

    @Column(name = "createdAt", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updatedAt", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "transferCountry", length = 100, nullable = false)
    private String transferCountry;

    @ManyToOne
    @JoinColumn(name = "partnerInstitution_id", nullable = false)
    private PartnerInstitution partnerInstitution;
}