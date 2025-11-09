package com.SBS_StudentServing_System.repository.academic;

import com.SBS_StudentServing_System.model.academic.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    List<Certificate> findByStudentId(String studentId);
    List<Certificate> findByPathway(String pathway);
}