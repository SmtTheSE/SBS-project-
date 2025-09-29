package com.SBS_StudentServing_System.dto.academic;


import lombok.Data;

@Data
public class StudyPlanDto {
    private String studyPlanId;
    private String pathwayName;
    private Integer totalCreditPoint;
    private String majorName;
}
