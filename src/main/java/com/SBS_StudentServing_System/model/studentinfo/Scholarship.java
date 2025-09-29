package com.SBS_StudentServing_System.model.studentinfo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "dim_Scholarship")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Scholarship {
    @Id
    @Column(name = "scholarship_id", length = 15)
    private String scholarshipId;

    private String scholarshipType;
    private Float amount;

    @Column(length = 255)
    private String description;
}
