package com.SBS_StudentServing_System.repository.academic;


import com.SBS_StudentServing_System.model.academic.LecturerCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LecturerCourseRepository extends JpaRepository<LecturerCourse, Long> {}
