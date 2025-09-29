package com.SBS_StudentServing_System.dto.academic;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class LecturerDto {
    private String lecturerId;
    private String name;
    private LocalDate dateOfBirth;
    private Integer teachingExperience;
    private String academicTitle;
    private String departmentId;
    private String departmentName;
}