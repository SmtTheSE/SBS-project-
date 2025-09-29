package com.SBS_StudentServing_System.repository.academic;

import com.SBS_StudentServing_System.model.academic.StudentEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentEnrollmentRepository extends JpaRepository<StudentEnrollment, Long> {}
