package com.SBS_StudentServing_System.model.studentinfo;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "subdim_partnerInstitute")
@Getter
@Setter
@Builder
public class PartnerInstitution {
    @Id
    @Column(name = "partnerInstitution_id", length = 15)
    private String partnerInstitutionId;

    @Column(name = "institutionName", length = 255, nullable = false)
    private String institutionName;

    @Column(name = "websiteUrl", length = 255)
    private String websiteUrl;

    @Column(name = "email", length = 100)
    private String email;
}