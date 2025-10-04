package com.SBS_StudentServing_System.service.academic;

import com.SBS_StudentServing_System.dto.academic.StudentAcademicBackgroundDto;
import com.SBS_StudentServing_System.mapping.StudentAcademicBackgroundMapper;
import com.SBS_StudentServing_System.model.academic.StudentAcademicBackground;
import com.SBS_StudentServing_System.model.student.Student;
import com.SBS_StudentServing_System.repository.academic.StudentAcademicBackgroundRepository;
import com.SBS_StudentServing_System.repository.student.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentAcademicBackgroundService {

    @Autowired
    private StudentAcademicBackgroundRepository studentAcademicBackgroundRepository;

    @Autowired
    private StudentRepository studentRepository;

    public List<StudentAcademicBackgroundDto> getAllStudentAcademicBackgroundsWithDto() {
  List<StudentAcademicBackground> backgrounds = studentAcademicBackgroundRepository.findAll();
        return backgrounds.stream()
                .map(StudentAcademicBackgroundMapper::toDto)
                .collect(Collectors.toList());
    }

    public StudentAcademicBackgroundDto getStudentAcademicBackgroundById(String id) {
        Optional<StudentAcademicBackground> background = studentAcademicBackgroundRepository.findById(id);
        return background.map(StudentAcademicBackgroundMapper::toDto).orElse(null);
    }

    public StudentAcademicBackgroundDto createStudentAcademicBackground(StudentAcademicBackgroundDto backgroundDto) {
        // Check if student exists
        Optional<Student> student = studentRepository.findById(backgroundDto.getStudentId());
        if (student.isPresent()) {
            StudentAcademicBackground background = StudentAcademicBackgroundMapper.toEntity(backgroundDto, student.get());
            StudentAcademicBackground savedBackground = studentAcademicBackgroundRepository.save(background);
            return StudentAcademicBackgroundMapper.toDto(savedBackground);
        }
        return null;
    }

    public StudentAcademicBackgroundDto updateStudentAcademicBackground(String id, StudentAcademicBackgroundDto backgroundDto) {
        System.out.println("Update request received for ID: '" + id + "'");

// Trim the ID to handle any trailing spaces
        String trimmedId = id.trim();
        System.out.println("Searching with trimmed ID: '" + trimmedId + "'");
        
        Optional<StudentAcademicBackground> existingBackground = studentAcademicBackgroundRepository.findById(trimmedId);
        if (existingBackground.isPresent()) {
           System.out.println("Found existing background with ID: '" + existingBackground.get().getBackgroundId() + "'");
            
            // Always use the student from existing record for updates
            Student student = existingBackground.get().getStudent();
            
            // Ensure studentId is set in DTO for mapping
            backgroundDto.setStudentId(student.getStudentId());
            
            StudentAcademicBackground background = StudentAcademicBackgroundMapper.toEntity(backgroundDto, student);
            background.setBackgroundId(trimmedId); // Ensure we keep the same ID for updates
            StudentAcademicBackground updatedBackground = studentAcademicBackgroundRepository.save(background);
            return StudentAcademicBackgroundMapper.toDto(updatedBackground);
        } else {
            System.out.println("No existing background found with trimmed ID: '" + trimmedId + "'");
            // Let's also try with the original ID
            System.out.println("Trying with original ID: '" + id + "'");
            existingBackground = studentAcademicBackgroundRepository.findById(id);
            if (existingBackground.isPresent()) {
                System.out.println("Found with original ID: '" + existingBackground.get().getBackgroundId() + "'");
                // Always use the student from existing record for updates
                Student student = existingBackground.get().getStudent();
                
                // Ensure studentId is set in DTO for mapping
                backgroundDto.setStudentId(student.getStudentId());
                
                StudentAcademicBackground background = StudentAcademicBackgroundMapper.toEntity(backgroundDto, student);
                background.setBackgroundId(id); // Ensure we keep the same ID for updates
                StudentAcademicBackground updatedBackground = studentAcademicBackgroundRepository.save(background);
                return StudentAcademicBackgroundMapper.toDto(updatedBackground);
            } else {
                System.out.println("No existing background found with original ID: '" + id + "'");
            }
        }
        return null; // Return null if the background doesn't exist instead of creating a new one
    }

public boolean deleteStudentAcademicBackground(String id) {
        if (studentAcademicBackgroundRepository.existsById(id)) {
            studentAcademicBackgroundRepository.deleteById(id);
            return true;
        }
        return false;
    }
}