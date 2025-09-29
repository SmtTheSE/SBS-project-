package com.SBS_StudentServing_System.service.studentinfo;

import com.SBS_StudentServing_System.dto.studentinfo.TuitionPaymentDto;
import com.SBS_StudentServing_System.model.studentinfo.TuitionPayment;
import com.SBS_StudentServing_System.model.student.Student;
import com.SBS_StudentServing_System.model.studentinfo.Scholarship;
import com.SBS_StudentServing_System.repository.student.DimScholarshipRepository;
import com.SBS_StudentServing_System.repository.student.TuitionPaymentRepository;
import com.SBS_StudentServing_System.repository.student.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TuitionPaymentService {

    @Autowired
    private TuitionPaymentRepository tuitionPaymentRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private DimScholarshipRepository scholarshipRepository;

    public List<TuitionPaymentDto> getAll() {
        return tuitionPaymentRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<TuitionPaymentDto> getByStudentId(String studentId) {
        return tuitionPaymentRepository.findByStudent_StudentId(studentId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public TuitionPaymentDto save(TuitionPaymentDto dto) {
        TuitionPayment entity = toEntity(dto);
        TuitionPayment saved = tuitionPaymentRepository.save(entity);
        return toDto(saved);
    }

    public void delete(Long id) {
        tuitionPaymentRepository.deleteById(id);
    }

    // Conversion methods
    private TuitionPaymentDto toDto(TuitionPayment entity) {
        TuitionPaymentDto dto = new TuitionPaymentDto();
        // Convert Student/Scholarship entities to their IDs
        if (entity.getStudent() != null) {
            dto.setStudentId(entity.getStudent().getStudentId());
        }
        if (entity.getScholarship() != null) {
            dto.setScholarshipId(entity.getScholarship().getScholarshipId());
        }
        dto.setPaymentStatus(entity.getPaymentStatus());
        dto.setPaymentMethod(entity.getPaymentMethod());
        dto.setAmountPaid(entity.getAmountPaid());
        return dto;
    }

    private TuitionPayment toEntity(TuitionPaymentDto dto) {
        TuitionPayment entity = new TuitionPayment();
        if (dto.getStudentId() != null) {
            Student student = studentRepository.findById(dto.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found: " + dto.getStudentId()));
            entity.setStudent(student);
        }
        if (dto.getScholarshipId() != null) {
            Scholarship scholarship = scholarshipRepository.findById(dto.getScholarshipId())
                    .orElse(null); // Allow null for optional field
            entity.setScholarship(scholarship);
        }
        entity.setPaymentStatus(dto.getPaymentStatus());
        entity.setPaymentMethod(dto.getPaymentMethod());
        entity.setAmountPaid((float) dto.getAmountPaid());
        return entity;
    }
}