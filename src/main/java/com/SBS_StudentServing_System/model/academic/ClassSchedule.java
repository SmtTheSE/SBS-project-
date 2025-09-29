package com.SBS_StudentServing_System.model.academic;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "dim_classSchedule")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassSchedule {

    @Column(name = "class_date")
    private LocalDate classDate;
    @Id
    @Column(name = "class_schedule_id", length = 15)
    private String classScheduleId;

    @ManyToOne
    @JoinColumn(name = "study_plan_course_id", nullable = false)
    private StudyPlanCourse studyPlanCourse;



    @Column(name = "day_of_week", nullable = false, length = 15)
    private String dayOfWeek;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @Column(name = "room", nullable = false, length = 50)
    private String room;
}