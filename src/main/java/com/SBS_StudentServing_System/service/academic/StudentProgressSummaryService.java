package com.SBS_StudentServing_System.service.academic;

import com.SBS_StudentServing_System.dto.academic.StudentProgressSummaryDto;
import com.SBS_StudentServing_System.mapping.StudentProgressSummaryMapper;
import com.SBS_StudentServing_System.model.academic.StudentProgressSummary;
import com.SBS_StudentServing_System.model.academic.StudyPlan;
import com.SBS_StudentServing_System.model.student.Student;
import com.SBS_StudentServing_System.repository.academic.StudentProgressSummaryRepository;
import com.SBS_StudentServing_System.repository.academic.StudyPlanRepository;
import com.SBS_StudentServing_System.repository.student.StudentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentProgressSummaryService {
    private final StudentProgressSummaryRepository studentProgressSummaryRepository;
    private final StudentRepository studentRepository;
    private final StudyPlanRepository studyPlanRepository;

    public List<StudentProgressSummaryDto> getAllStudentProgressSummaries() {
        return studentProgressSummaryRepository.findAll().stream()
                .map(StudentProgressSummaryMapper::toDto)
                .collect(Collectors.toList());
    }

    public StudentProgressSummaryDto getStudentProgressSummaryById(Long id) {
        StudentProgressSummary studentProgressSummary = studentProgressSummaryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("StudentProgressSummary not found with id: " + id));
        return StudentProgressSummaryMapper.toDto(studentProgressSummary);
    }

    public StudentProgressSummaryDto createStudentProgressSummary(StudentProgressSummaryDto studentProgressSummaryDto) {
        Student student = studentRepository.findById(studentProgressSummaryDto.getStudentId())
                .orElseThrow(() -> new EntityNotFoundException("Student not found with id: " + studentProgressSummaryDto.getStudentId()));
        
        StudyPlan studyPlan = studyPlanRepository.findById(studentProgressSummaryDto.getStudyPlanId())
                .orElseThrow(() -> new EntityNotFoundException("StudyPlan not found with id: " + studentProgressSummaryDto.getStudyPlanId()));

        StudentProgressSummary studentProgressSummary = StudentProgressSummaryMapper.toEntity(studentProgressSummaryDto, student, studyPlan);
        StudentProgressSummary savedStudentProgressSummary = studentProgressSummaryRepository.save(studentProgressSummary);
        return StudentProgressSummaryMapper.toDto(savedStudentProgressSummary);
    }

    public StudentProgressSummaryDto updateStudentProgressSummary(Long id, StudentProgressSummaryDto studentProgressSummaryDto) {
        StudentProgressSummary existingStudentProgressSummary = studentProgressSummaryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("StudentProgressSummary not found with id: " + id));

        Student student = studentRepository.findById(studentProgressSummaryDto.getStudentId())
                .orElseThrow(() -> new EntityNotFoundException("Student not found with id: " + studentProgressSummaryDto.getStudentId()));
        
        StudyPlan studyPlan = studyPlanRepository.findById(studentProgressSummaryDto.getStudyPlanId())
                .orElseThrow(() -> new EntityNotFoundException("StudyPlan not found with id: " + studentProgressSummaryDto.getStudyPlanId()));

        existingStudentProgressSummary.setStudent(student);
        existingStudentProgressSummary.setStudyPlan(studyPlan);
        existingStudentProgressSummary.setTotalEnrolledCourse(studentProgressSummaryDto.getTotalEnrolledCourse() != null ? studentProgressSummaryDto.getTotalEnrolledCourse() : 0);
        existingStudentProgressSummary.setTotalCompletedCourse(studentProgressSummaryDto.getTotalCompletedCourse() != null ? studentProgressSummaryDto.getTotalCompletedCourse() : 0);
        existingStudentProgressSummary.setTotalCreditsEarned(studentProgressSummaryDto.getTotalCreditsEarned() != null ? studentProgressSummaryDto.getTotalCreditsEarned() : 0);

        StudentProgressSummary updatedStudentProgressSummary = studentProgressSummaryRepository.save(existingStudentProgressSummary);
        return StudentProgressSummaryMapper.toDto(updatedStudentProgressSummary);
    }

    public void deleteStudentProgressSummary(Long id) {
        StudentProgressSummary studentProgressSummary = studentProgressSummaryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("StudentProgressSummary not found with id: " + id));
        studentProgressSummaryRepository.delete(studentProgressSummary);
    }
}