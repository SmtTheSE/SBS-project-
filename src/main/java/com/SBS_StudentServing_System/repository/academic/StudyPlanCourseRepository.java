package com.SBS_StudentServing_System.repository.academic;

import com.SBS_StudentServing_System.model.academic.StudyPlanCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyPlanCourseRepository extends JpaRepository<StudyPlanCourse, String> {


    @Query("SELECT spc FROM StudyPlanCourse spc JOIN StudentEnrollment e ON spc.studyPlanCourseId = e.studyPlanCourse.studyPlanCourseId WHERE e.student.studentId = :studentId")
    List<StudyPlanCourse> findByStudentId(@Param("studentId") String studentId);

}
