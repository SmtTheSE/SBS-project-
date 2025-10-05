package com.SBS_StudentServing_System.repository.academic;

import com.SBS_StudentServing_System.model.academic.AttendanceSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceSummaryRepository extends JpaRepository<AttendanceSummary, Long> {
    List<AttendanceSummary> findByStudentStudentId(String studentId);
}