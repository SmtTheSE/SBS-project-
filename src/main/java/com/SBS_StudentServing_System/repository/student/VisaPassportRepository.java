package com.SBS_StudentServing_System.repository.student;

import com.SBS_StudentServing_System.model.studentinfo.StudentScholarship;
import com.SBS_StudentServing_System.model.studentinfo.VisaPassport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VisaPassportRepository extends JpaRepository<VisaPassport, String> {
    List<VisaPassport> findByStudent_StudentId(String studentId);
}
