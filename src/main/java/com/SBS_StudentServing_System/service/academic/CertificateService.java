package com.SBS_StudentServing_System.service.academic;

import com.SBS_StudentServing_System.model.academic.Certificate;
import com.SBS_StudentServing_System.repository.academic.CertificateRepository;
import com.SBS_StudentServing_System.model.student.Student;
import com.SBS_StudentServing_System.repository.student.StudentRepository;
import com.SBS_StudentServing_System.model.academic.StudyPlan;
import com.SBS_StudentServing_System.repository.academic.StudyPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CertificateService {

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private StudyPlanRepository studyPlanRepository;

    public Certificate saveCertificate(String studentId, String fileName, String filePath, String certificateType, String description) {
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (!studentOpt.isPresent()) {
            throw new RuntimeException("Student not found with ID: " + studentId);
        }

        Student student = studentOpt.get();
        String studentName = student.getFirstName() + " " + student.getLastName();
        String email = student.getStudentEmail();
        String pathway = "Unknown";

        if (student.getStudyPlanId() != null) {
            Optional<StudyPlan> studyPlanOpt = studyPlanRepository.findById(student.getStudyPlanId());
            if (studyPlanOpt.isPresent()) {
                pathway = studyPlanOpt.get().getPathwayName();
            }
        }

        Certificate certificate = Certificate.builder()
                .studentId(studentId)
                .studentName(studentName)
                .email(email)
                .pathway(pathway)
                .fileName(fileName)
                .filePath(filePath)
                .certificateType(certificateType)
                .uploadedAt(LocalDateTime.now())
                .description(description)
                .build();

        return certificateRepository.save(certificate);
    }

    public List<Certificate> getAllCertificates() {
        return certificateRepository.findAll();
    }

    public List<Certificate> getCertificatesByStudentId(String studentId) {
        return certificateRepository.findByStudentId(studentId);
    }

    public List<Certificate> getCertificatesByPathway(String pathway) {
        return certificateRepository.findByPathway(pathway);
    }

    public Optional<Certificate> getCertificateById(Long id) {
        return certificateRepository.findById(id);
    }

    public void deleteCertificate(Long id) {
        certificateRepository.deleteById(id);
    }
}