package com.SBS_StudentServing_System.repository.student;

import com.SBS_StudentServing_System.model.studentinfo.StudentScholarship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentScholarshipRepository extends JpaRepository<StudentScholarship, Long> {
    // FIXED method name!
    List<StudentScholarship> findByStudent_StudentId(String studentId);
}
