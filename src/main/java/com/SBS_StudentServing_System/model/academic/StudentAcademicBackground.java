package com.SBS_StudentServing_System.model.academic;

import com.SBS_StudentServing_System.model.student.Student;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "dim_studentAcademicBackground")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentAcademicBackground {
    @Id
    @Column(name = "background_id", length = 15)
    private String backgroundId;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "highestQualification", nullable = false, length = 100)
    private String highestQualification;

    @Column(name = "institution_name", nullable = false, length = 150)
    private String institutionName;

    @Column(name = "englishQualification", length = 100)
    private String englishQualification;

    @Column(name = "englishScore")
    private Float englishScore;

    @Column(name = "required_for_placement_test", nullable = false)
    private Boolean requiredForPlacementTest = false;

    @Column(name = "document_url", length = 255)
    private String documentUrl;
}

