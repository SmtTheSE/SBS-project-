package com.SBS_StudentServing_System.service.studentinfo;

import com.SBS_StudentServing_System.dto.studentinfo.HealthInsuranceDto;
import com.SBS_StudentServing_System.model.studentinfo.HealthInsurance;
import com.SBS_StudentServing_System.model.student.Student;
import com.SBS_StudentServing_System.model.admin.Admin;
import com.SBS_StudentServing_System.repository.student.HealthInsuranceRepository;
import com.SBS_StudentServing_System.repository.student.StudentRepository;
import com.SBS_StudentServing_System.repository.admin.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HealthInsuranceService {

    @Autowired
    private HealthInsuranceRepository healthInsuranceRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AdminRepository adminRepository;

    public List<HealthInsuranceDto> getAll() {
        return healthInsuranceRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<HealthInsuranceDto> getByStudentId(String studentId) {
        return healthInsuranceRepository.findByStudent_StudentId(studentId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public HealthInsuranceDto save(HealthInsuranceDto dto) {
        HealthInsurance entity = toEntity(dto);
        HealthInsurance saved = healthInsuranceRepository.save(entity);
        return toDto(saved);
    }

    public void delete(String id) {
        healthInsuranceRepository.deleteById(id);
    }

    // Conversion methods
    private HealthInsuranceDto toDto(HealthInsurance entity) {
        HealthInsuranceDto dto = new HealthInsuranceDto();
        dto.setHealthInsuranceId(entity.getHealthInsuranceId());
        // Map entity objects to IDs
        if (entity.getStudent() != null) {
            dto.setStudentId(entity.getStudent().getStudentId());
        }
        if (entity.getAdmin() != null) {
            dto.setAdminId(entity.getAdmin().getAdminId());
        }
        dto.setInsuranceNumber(entity.getInsuranceNumber());
        dto.setValidFrom(entity.getValidFrom());
        dto.setValidUntil(entity.getValidUntil());
        dto.setFilePath(entity.getFilePath());
        dto.setOptionalMessage(entity.getOptionalMessage());
        return dto;
    }

    private HealthInsurance toEntity(HealthInsuranceDto dto) {
        HealthInsurance entity = new HealthInsurance();
        entity.setHealthInsuranceId(dto.getHealthInsuranceId());
        // Map IDs from dto to entity objects
        if (dto.getStudentId() != null) {
            Student student = studentRepository.findById(dto.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found: " + dto.getStudentId()));
            entity.setStudent(student);
        }
        if (dto.getAdminId() != null) {
            Admin admin = adminRepository.findById(dto.getAdminId())
                    .orElseThrow(() -> new RuntimeException("Admin not found: " + dto.getAdminId()));
            entity.setAdmin(admin);
        }
        entity.setInsuranceNumber(dto.getInsuranceNumber());
        entity.setValidFrom(dto.getValidFrom());
        entity.setValidUntil(dto.getValidUntil());
        entity.setFilePath(dto.getFilePath());
        entity.setOptionalMessage(dto.getOptionalMessage());
        return entity;
    }
}