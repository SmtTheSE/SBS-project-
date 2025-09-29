package com.SBS_StudentServing_System.dto.academic;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor

public class ClassScheduleDto {
    private String classScheduleId;
    private String studyPlanCourseId;
    private String dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer durationMinutes;
    private String room;

    public ClassScheduleDto(String classScheduleId, String studyPlanCourseId, String dayOfWeek,
                            LocalTime startTime, LocalTime endTime, Integer durationMinutes, String room) {
        this.classScheduleId = classScheduleId;
        this.studyPlanCourseId = studyPlanCourseId;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.durationMinutes = durationMinutes;
        this.room = room;
    }

}
