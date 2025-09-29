package com.SBS_StudentServing_System.dto.student;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class StudentCreateDto {
    // Student information
    private String studentId;
    private String accountId;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String phone;
    private String studentEmail;
    private String homeAddress;
    private String wardId;
    private String wardName; // 新增区域名称字段
    private String cityId;
    private String cityName; // 新增城市名称字段
    private String streetAddress;
    private String buildingName;
    private Integer gender;
    private String nationality;
    private String nationalId;
    private String studyPlanId;
    private String password; // 新增密码字段
    
    // Account information
    private String accountRole;
    private Integer accountStatus;
}