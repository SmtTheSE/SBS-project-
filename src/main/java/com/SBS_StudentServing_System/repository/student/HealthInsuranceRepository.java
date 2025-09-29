package com.SBS_StudentServing_System.repository.student;

import com.SBS_StudentServing_System.model.studentinfo.HealthInsurance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthInsuranceRepository extends JpaRepository<HealthInsurance, String> {
    List<HealthInsurance> findByStudent_StudentId(String studentId);
}
