package com.SBS_StudentServing_System.service.studentinfo;

import com.SBS_StudentServing_System.dto.studentinfo.StudentScholarshipDto;
import com.SBS_StudentServing_System.model.studentinfo.StudentScholarship;
import com.SBS_StudentServing_System.model.student.Student;
import com.SBS_StudentServing_System.model.studentinfo.Scholarship;
import com.SBS_StudentServing_System.repository.student.StudentRepository;
import com.SBS_StudentServing_System.repository.student.StudentScholarshipRepository;
import com.SBS_StudentServing_System.repository.student.DimScholarshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentScholarshipService {

    @Autowired
    private StudentScholarshipRepository studentScholarshipRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private DimScholarshipRepository scholarshipRepository;

    public List<StudentScholarshipDto> getAll() {
        return studentScholarshipRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<StudentScholarshipDto> getByStudentId(String studentId) {
        return studentScholarshipRepository.findByStudent_StudentId(studentId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public StudentScholarshipDto save(StudentScholarshipDto dto) {
        StudentScholarship entity = toEntity(dto);
        StudentScholarship saved = studentScholarshipRepository.save(entity);
        return toDto(saved);
    }

    public void delete(Long id) {
        studentScholarshipRepository.deleteById(id);
    }

    private StudentScholarshipDto toDto(StudentScholarship entity) {
        StudentScholarshipDto dto = new StudentScholarshipDto();
        dto.setId(entity.getId());
        // Map entity objects to IDs
        if (entity.getStudent() != null) {
            dto.setStudentId(entity.getStudent().getStudentId());
        }
        if (entity.getScholarship() != null) {
            dto.setScholarshipId(entity.getScholarship().getScholarshipId());
        }
        dto.setScholarshipPercentage(entity.getScholarshipPercentage());
        return dto;
    }

    private StudentScholarship toEntity(StudentScholarshipDto dto) {
        StudentScholarship entity = new StudentScholarship();
        entity.setId(dto.getId());
        // Map IDs from dto to entity objects
        if (dto.getStudentId() != null) {
            Student student = studentRepository.findById(dto.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found: " + dto.getStudentId()));
            entity.setStudent(student);
        }
        if (dto.getScholarshipId() != null) {
            Scholarship scholarship = scholarshipRepository.findById(dto.getScholarshipId())
                    .orElseThrow(() -> new RuntimeException("Scholarship not found: " + dto.getScholarshipId()));
            entity.setScholarship(scholarship);
        }
        entity.setScholarshipPercentage(dto.getScholarshipPercentage());
        return entity;
    }
}