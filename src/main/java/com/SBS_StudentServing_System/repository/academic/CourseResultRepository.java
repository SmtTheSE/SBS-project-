package com.SBS_StudentServing_System.repository.academic;

import com.SBS_StudentServing_System.model.academic.CourseResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseResultRepository extends JpaRepository<CourseResult, Long> {
    @Query("SELECT SUM(cr.creditsEarned) FROM CourseResult cr WHERE cr.student.studentId = :studentId")
    Integer getTotalCreditsEarnedByStudentId(@Param("studentId") String studentId);

    @Query("SELECT cr FROM CourseResult cr WHERE cr.student.studentId = :studentId")
    List<CourseResult> findAllByStudentId(@Param("studentId") String studentId);

}
