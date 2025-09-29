package com.SBS_StudentServing_System.model.lecturer;

import com.SBS_StudentServing_System.model.academic.Department;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "dim_Lecturer")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lecturer {

    @Id
    @Column(name = "lecturer_id", length = 15, nullable = false, unique = true)
    private String lecturerId;

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "dateOfBirth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(name = "teachingExperience", nullable = false)
    private Integer teachingExperience;

    @Column(name = "academicTitle", length = 100)
    private String academicTitle;

    @ManyToOne
    @JoinColumn(name = "departmentId", nullable = false)
    @JsonIgnore
    private Department department;

}