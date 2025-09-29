package com.SBS_StudentServing_System.dto.studentinfo;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;


@Getter
@Setter
public class VisaPassportDto {
    private String visaPassportId;
    private String studentId;
    private String visaId;
    private LocalDate visaIssuedDate;
    private LocalDate visaExpiredDate;
    private int visaType; // 0 = Single Entry, 1 = Multiple Entry
    private String passportNumber;
    private LocalDate passportIssuedDate;
    private LocalDate passportExpiredDate;

}
