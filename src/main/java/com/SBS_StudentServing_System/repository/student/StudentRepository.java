package com.SBS_StudentServing_System.repository.student;

import com.SBS_StudentServing_System.model.student.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, String> {
    Optional<Student> findByLoginAccount_AccountId(String accountId);

    Optional<Student> findByStudentEmail(String studentEmail);
}
