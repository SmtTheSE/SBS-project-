package com.SBS_StudentServing_System.dto.academic;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
public class ClassTimelineDto {
    private String classScheduleId;
    private LocalDate classDate;
    private String dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer durationMinutes;
    private String room;
    private String courseName;
    private String lecturerName;
}
