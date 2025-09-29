package com.SBS_StudentServing_System.dto.studentinfo;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentScholarshipDto {
    private Long id;
    private String studentId;
    private String scholarshipId;
    private int scholarshipPercentage;
}