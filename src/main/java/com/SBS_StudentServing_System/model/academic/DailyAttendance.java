package com.SBS_StudentServing_System.model.academic;

import com.SBS_StudentServing_System.model.student.Student;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "fact_daily_attendance",
        indexes = {
                @Index(name = "idx_fact_daily_attendance_student", columnList = "student_id"),
                @Index(name = "idx_fact_daily_attendance_schedule", columnList = "class_schedule_id")
        })
@IdClass(DailyAttendanceId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyAttendance {

    @Id
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Id
    @ManyToOne
    @JoinColumn(name = "class_schedule_id", nullable = false)
    private ClassSchedule classSchedule;

    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;

    @Column(name = "status", nullable = false, length = 50)
    private String status; // 'Present', 'Absent', 'Absent with permission', 'Late'

    @Column(name = "check_in_time")
    private LocalTime checkInTime;

    @Column(name = "check_out_time")
    private LocalTime checkOutTime;

    @Column(name = "note", length = 255)
    private String note;
}