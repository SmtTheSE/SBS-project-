package com.SBS_StudentServing_System.dto.academic;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyAttendanceDto {

    private String studentId;
    private String studentName;
    private String classScheduleId;
    private String courseId;
    private String courseName;
    private LocalDate attendanceDate;
    private String status; // 'Present', 'Absent', 'Absent with permission', 'Late'
    private LocalTime checkInTime;
    private LocalTime checkOutTime;
    private String note;
    private String semesterName;
    private String departmentName;
}