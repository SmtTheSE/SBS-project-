package com.SBS_StudentServing_System.model.academic;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "dim_grade")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Grade {
    @Id
    @Column(name = "grade_name", length = 5)
    private String gradeName;

    @Column(name = "description", length = 100)
    private String description;
}