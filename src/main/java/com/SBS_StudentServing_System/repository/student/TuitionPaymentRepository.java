package com.SBS_StudentServing_System.repository.student;

import com.SBS_StudentServing_System.model.studentinfo.StudentScholarship;
import com.SBS_StudentServing_System.model.studentinfo.TuitionPayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TuitionPaymentRepository extends JpaRepository<TuitionPayment, Long> {
    List<TuitionPayment> findByStudent_StudentId(String studentId);
}
