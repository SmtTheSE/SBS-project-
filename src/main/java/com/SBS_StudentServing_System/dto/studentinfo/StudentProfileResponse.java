package com.SBS_StudentServing_System.dto.studentinfo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfileResponse {
    private String studentId;
    private String name;
    private String nativeCountry;
    private String email;
    private String pathway;
}
