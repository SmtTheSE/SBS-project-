package com.SBS_StudentServing_System.dto.student;

import com.SBS_StudentServing_System.dto.account.LoginAccountDto;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class StudentDto {
    private String studentId;
    private LoginAccountDto loginAccount;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String phone;
    private String studentEmail;
    private String homeAddress;
    private String wardId;
    private String cityId;
    private String streetAddress;
    private String buildingName;
    private Integer gender;
    private String nationality;
    private String nationalId;
    private String studyPlanId;
}