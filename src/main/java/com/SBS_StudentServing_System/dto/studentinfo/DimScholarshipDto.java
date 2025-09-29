package com.SBS_StudentServing_System.dto.studentinfo;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DimScholarshipDto {
    private String scholarshipId;
    private String scholarshipType;
    private double amount;
    private String description;
}
