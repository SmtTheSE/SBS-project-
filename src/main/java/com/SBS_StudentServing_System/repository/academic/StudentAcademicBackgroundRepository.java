package com.SBS_StudentServing_System.repository.academic;

import com.SBS_StudentServing_System.model.academic.StudentAcademicBackground;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentAcademicBackgroundRepository extends JpaRepository<StudentAcademicBackground, String> {}
