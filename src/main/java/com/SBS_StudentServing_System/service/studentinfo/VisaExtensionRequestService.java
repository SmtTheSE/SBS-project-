package com.SBS_StudentServing_System.service.studentinfo;

import com.SBS_StudentServing_System.dto.studentinfo.VisaExtensionRequestDto;
import com.SBS_StudentServing_System.model.admin.Admin;
import com.SBS_StudentServing_System.model.student.Student;
import com.SBS_StudentServing_System.model.studentinfo.VisaExtensionRequest;
import com.SBS_StudentServing_System.model.studentinfo.VisaPassport;
import com.SBS_StudentServing_System.repository.admin.AdminRepository;
import com.SBS_StudentServing_System.repository.student.StudentRepository;
import com.SBS_StudentServing_System.repository.student.VisaExtensionRequestRepository;
import com.SBS_StudentServing_System.repository.student.VisaPassportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VisaExtensionRequestService {

    @Autowired
    private VisaExtensionRequestRepository visaExtensionRequestRepository;

    @Autowired
    private VisaPassportRepository visaPassportRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AdminRepository adminRepository;

    public List<VisaExtensionRequestDto> getAll() {
        return visaExtensionRequestRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<VisaExtensionRequestDto> getByStudentId(String studentId) {
        return visaExtensionRequestRepository.findByStudent_StudentId(studentId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public VisaExtensionRequestDto save(VisaExtensionRequestDto dto) {
        try {
            VisaExtensionRequest entity = toEntity(dto);
            VisaExtensionRequest saved = visaExtensionRequestRepository.save(entity);
            return toDto(saved);
        } catch (Exception e) {
            throw new RuntimeException("Error saving visa extension request: " + e.getMessage(), e);
        }
    }

    public void delete(String id) {
        visaExtensionRequestRepository.deleteById(id);
    }

    public List<VisaExtensionRequestDto> getPendingRequests() {
        return visaExtensionRequestRepository.findByStatus(0).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public VisaExtensionRequestDto getById(String id) {
        VisaExtensionRequest entity = visaExtensionRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visa extension request not found: " + id));
        return toDto(entity);
    }

    // Conversion methods
    private VisaExtensionRequestDto toDto(VisaExtensionRequest entity) {
        VisaExtensionRequestDto dto = new VisaExtensionRequestDto();
        dto.setExtensionRequestId(entity.getExtensionRequestId());
        if (entity.getVisaPassport() != null)
            dto.setVisaPassportId(entity.getVisaPassport().getVisaPassportId());
        if (entity.getStudent() != null)
            dto.setStudentId(entity.getStudent().getStudentId());
        if (entity.getAdmin() != null)
            dto.setAdminId(entity.getAdmin().getAdminId());
        dto.setRequestDate(entity.getRequestDate());
        dto.setRequestedExtensionUntil(entity.getRequestedExtensionUntil());
        dto.setStatus(entity.getStatus());
        dto.setNotes(entity.getNotes());
        return dto;
    }

    private VisaExtensionRequest toEntity(VisaExtensionRequestDto dto) {
        VisaExtensionRequest entity = new VisaExtensionRequest();
        entity.setExtensionRequestId(dto.getExtensionRequestId());
        if (dto.getVisaPassportId() != null) {
            VisaPassport visaPassport = visaPassportRepository.findById(dto.getVisaPassportId())
                    .orElseThrow(() -> new RuntimeException("VisaPassport not found: " + dto.getVisaPassportId()));
            entity.setVisaPassport(visaPassport);
        }
        if (dto.getStudentId() != null) {
            Student student = studentRepository.findById(dto.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found: " + dto.getStudentId()));
            entity.setStudent(student);
        }
        if (dto.getAdminId() != null) {
            Admin admin = adminRepository.findById(dto.getAdminId())
                    .orElseThrow(() -> new RuntimeException("Admin not found: " + dto.getAdminId() + ". Available admins: " + 
                        String.join(", ", adminRepository.findAll().stream().map(Admin::getAdminId).collect(Collectors.toList()))));
            entity.setAdmin(admin);
        }
        entity.setRequestDate(dto.getRequestDate());
        entity.setRequestedExtensionUntil(dto.getRequestedExtensionUntil());
        entity.setStatus(dto.getStatus());
        entity.setNotes(dto.getNotes());
        return entity;
    }
}
