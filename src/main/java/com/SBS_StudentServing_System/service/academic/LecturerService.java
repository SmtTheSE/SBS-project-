package com.SBS_StudentServing_System.service.academic;

import com.SBS_StudentServing_System.dto.academic.LecturerCreateDto;
import com.SBS_StudentServing_System.dto.academic.LecturerDto;
import com.SBS_StudentServing_System.model.academic.Department;
import com.SBS_StudentServing_System.model.lecturer.Lecturer;
import com.SBS_StudentServing_System.repository.academic.DepartmentRepository;
import com.SBS_StudentServing_System.repository.lecturer.LecturerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LecturerService {

    private final LecturerRepository lecturerRepository;
    private final DepartmentRepository departmentRepository;

    public LecturerService(LecturerRepository lecturerRepository, DepartmentRepository departmentRepository) {
        this.lecturerRepository = lecturerRepository;
        this.departmentRepository = departmentRepository;
    }

    public List<LecturerDto> getAllLecturers() {
        return lecturerRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public LecturerDto getLecturer(String lecturerId) {
        Optional<Lecturer> lecturerOpt = lecturerRepository.findById(lecturerId);
        return lecturerOpt.map(this::toDto).orElse(null);
    }

    public LecturerDto createLecturer(LecturerCreateDto dto) {
        // Check if department exists
        Optional<Department> departmentOpt = departmentRepository.findById(dto.getDepartmentId());
        if (departmentOpt.isEmpty()) {
            throw new RuntimeException("Department not found with ID: " + dto.getDepartmentId());
        }

        // Create lecturer
        Lecturer lecturer = new Lecturer();
        lecturer.setLecturerId(dto.getLecturerId());
        lecturer.setName(dto.getName());
        lecturer.setDateOfBirth(dto.getDateOfBirth());
        lecturer.setTeachingExperience(dto.getTeachingExperience() != null ? dto.getTeachingExperience() : 0);
        lecturer.setAcademicTitle(dto.getAcademicTitle());
        lecturer.setDepartment(departmentOpt.get());

        Lecturer savedLecturer = lecturerRepository.save(lecturer);
        return toDto(savedLecturer);
    }

    public LecturerDto updateLecturer(String lecturerId, LecturerCreateDto dto) {
        Optional<Lecturer> lecturerOpt = lecturerRepository.findById(lecturerId);
        if (lecturerOpt.isEmpty()) {
            return null;
        }

        Lecturer lecturer = lecturerOpt.get();

        // Update lecturer information
        lecturer.setName(dto.getName());
        lecturer.setDateOfBirth(dto.getDateOfBirth());
        lecturer.setTeachingExperience(dto.getTeachingExperience() != null ? dto.getTeachingExperience() : 0);
        lecturer.setAcademicTitle(dto.getAcademicTitle());

        // Update department if provided
        if (dto.getDepartmentId() != null && !dto.getDepartmentId().isEmpty()) {
            Optional<Department> departmentOpt = departmentRepository.findById(dto.getDepartmentId());
            if (departmentOpt.isPresent()) {
                lecturer.setDepartment(departmentOpt.get());
            } else {
                throw new RuntimeException("Department not found with ID: " + dto.getDepartmentId());
            }
        }

        Lecturer updatedLecturer = lecturerRepository.save(lecturer);
        return toDto(updatedLecturer);
    }

    public boolean deleteLecturer(String lecturerId) {
        Optional<Lecturer> lecturerOpt = lecturerRepository.findById(lecturerId);
        if (lecturerOpt.isEmpty()) {
            return false;
        }

        lecturerRepository.delete(lecturerOpt.get());
        return true;
    }

    private LecturerDto toDto(Lecturer lecturer) {
        LecturerDto dto = new LecturerDto();
        dto.setLecturerId(lecturer.getLecturerId());
        dto.setName(lecturer.getName());
        dto.setDateOfBirth(lecturer.getDateOfBirth());
        dto.setTeachingExperience(lecturer.getTeachingExperience());
        dto.setAcademicTitle(lecturer.getAcademicTitle());

        if (lecturer.getDepartment() != null) {
            dto.setDepartmentId(lecturer.getDepartment().getDepartmentId());
            dto.setDepartmentName(lecturer.getDepartment().getDepartmentName());
        }

        return dto;
    }
}