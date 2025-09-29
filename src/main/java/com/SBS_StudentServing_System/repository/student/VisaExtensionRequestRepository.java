package com.SBS_StudentServing_System.repository.student;

import com.SBS_StudentServing_System.model.studentinfo.StudentScholarship;
import com.SBS_StudentServing_System.model.studentinfo.VisaExtensionRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VisaExtensionRequestRepository extends JpaRepository<VisaExtensionRequest, String> {
    List<VisaExtensionRequest> findByStudent_StudentId(String studentId);
    
    List<VisaExtensionRequest> findByStatus(int status);
}
