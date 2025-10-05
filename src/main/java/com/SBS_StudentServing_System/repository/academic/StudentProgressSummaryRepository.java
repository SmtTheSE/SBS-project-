package com.SBS_StudentServing_System.repository.academic;

import com.SBS_StudentServing_System.model.academic.StudentProgressSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentProgressSummaryRepository extends JpaRepository<StudentProgressSummary, Long> {
    List<StudentProgressSummary> findByStudentStudentId(String studentId);
}