package com.SBS_StudentServing_System.repository.academic;

import com.SBS_StudentServing_System.model.academic.DailyAttendance;
import com.SBS_StudentServing_System.model.academic.DailyAttendanceId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DailyAttendanceRepository extends JpaRepository<DailyAttendance, DailyAttendanceId> {

    // Essential method for your frontend - get student's attendance records
    List<DailyAttendance> findByStudentStudentId(String studentId);
}