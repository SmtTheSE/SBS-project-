package com.SBS_StudentServing_System.repository.academic;

import com.SBS_StudentServing_System.dto.academic.ClassScheduleDto;
import com.SBS_StudentServing_System.dto.academic.ClassTimelineDto;
import com.SBS_StudentServing_System.model.academic.ClassSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface ClassScheduleRepository extends JpaRepository<ClassSchedule, String> {

    @Query("""
    SELECT new com.SBS_StudentServing_System.dto.academic.ClassTimelineDto(
        cs.classScheduleId,
        cs.classDate,
        cs.dayOfWeek,
        cs.startTime,
        cs.endTime,
        cs.durationMinutes,
        cs.room,
        c.courseName,
        l.name
    )
    FROM ClassSchedule cs
    JOIN cs.studyPlanCourse spc
    JOIN spc.course c
    JOIN LecturerCourse lc ON lc.studyPlanCourse = spc AND lc.classSchedule = cs
    JOIN lc.lecturer l
    JOIN StudentEnrollment se ON se.studyPlanCourse = spc
    WHERE se.student.studentId = :studentId
""")

    List<ClassTimelineDto> findClassTimelinesByStudentId(@Param("studentId") String studentId);


}
