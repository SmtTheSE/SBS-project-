package com.SBS_StudentServing_System.model.academic;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "dim_studyplan")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyPlan {
    @Id
    @Column(name = "study_plan_id", length = 15)
    private String studyPlanId;

    @Column(name = "pathway_name", nullable = false, length = 100)
    private String pathwayName;

    @Column(name = "total_credit_point", nullable = false)
    private Integer totalCreditPoint = 0;

    @Column(name = "major_name", nullable = false, length = 100)
    private String majorName;
}
