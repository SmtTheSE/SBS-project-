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
@Table(name = "dim_semester")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Semester {
    @Id
    @Column(name = "semester_id", length = 15)
    private String semesterId;

    @Column(name = "year", nullable = false)
    private LocalDate year;

    @Column(name = "intakeMonth", nullable = false, length = 50)
    private String intakeMonth;

    @Column(name = "term", nullable = false, length = 50)
    private String term;
}