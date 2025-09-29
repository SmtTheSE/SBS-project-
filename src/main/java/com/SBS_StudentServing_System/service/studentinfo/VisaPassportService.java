package com.SBS_StudentServing_System.service.studentinfo;

import com.SBS_StudentServing_System.dto.studentinfo.VisaPassportDto;
import com.SBS_StudentServing_System.model.studentinfo.VisaPassport;
import com.SBS_StudentServing_System.model.student.Student;
import com.SBS_StudentServing_System.repository.student.VisaPassportRepository;
import com.SBS_StudentServing_System.repository.student.VisaPassportRepository;
import com.SBS_StudentServing_System.repository.student.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VisaPassportService {

    @Autowired
    private VisaPassportRepository visaPassportRepository;

    @Autowired
    private StudentRepository studentRepository;

    public List<VisaPassportDto> getAllVisaPassports() {
        return visaPassportRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<VisaPassportDto> getVisaPassportsByStudentId(String studentId) {
        return visaPassportRepository.findByStudent_StudentId(studentId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public VisaPassportDto getById(String id) {
        return visaPassportRepository.findById(id)
                .map(this::toDto)
                .orElse(null);
    }

    public VisaPassportDto save(VisaPassportDto dto) {
        VisaPassport entity = toEntity(dto);
        VisaPassport saved = visaPassportRepository.save(entity);
        return toDto(saved);
    }

    public void delete(String id) {
        visaPassportRepository.deleteById(id);
    }

    // Conversion methods
    private VisaPassportDto toDto(VisaPassport entity) {
        VisaPassportDto dto = new VisaPassportDto();
        dto.setVisaPassportId(entity.getVisaPassportId());
        // Convert Student entity to studentId string
        if(entity.getStudent() != null) {
            dto.setStudentId(entity.getStudent().getStudentId());
        }
        dto.setVisaId(entity.getVisaId());
        dto.setVisaIssuedDate(entity.getVisaIssuedDate());
        dto.setVisaExpiredDate(entity.getVisaExpiredDate());
        dto.setVisaType(entity.getVisaType());
        dto.setPassportNumber(entity.getPassportNumber());
        dto.setPassportIssuedDate(entity.getPassportIssuedDate());
        dto.setPassportExpiredDate(entity.getPassportExpiredDate());
        return dto;
    }

    private VisaPassport toEntity(VisaPassportDto dto) {
        VisaPassport entity = new VisaPassport();
        entity.setVisaPassportId(dto.getVisaPassportId());
        // Convert studentId string to Student entity
        if(dto.getStudentId() != null) {
            Student student = studentRepository.findById(dto.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found with id: " + dto.getStudentId()));
            entity.setStudent(student);
        }
        entity.setVisaId(dto.getVisaId());
        entity.setVisaIssuedDate(dto.getVisaIssuedDate());
        entity.setVisaExpiredDate(dto.getVisaExpiredDate());
        entity.setVisaType(dto.getVisaType());
        entity.setPassportNumber(dto.getPassportNumber());
        entity.setPassportIssuedDate(dto.getPassportIssuedDate());
        entity.setPassportExpiredDate(dto.getPassportExpiredDate());
        return entity;
    }
}