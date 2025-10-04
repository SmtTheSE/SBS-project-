package com.SBS_StudentServing_System.service.academic;

import com.SBS_StudentServing_System.dto.academic.StudentProgressSummaryDto;
import com.SBS_StudentServing_System.mapping.StudentProgressSummaryMapper;
import com.SBS_StudentServing_System.model.academic.StudentProgressSummary;
import com.SBS_StudentServing_System.model.student.Student;
import com.SBS_StudentServing_System.repository.academic.StudentProgressSummaryRepository;
import com.SBS_StudentServing_System.repository.student.StudentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentProgressSummaryService {
    private final StudentProgressSummaryRepository studentProgressSummaryRepository;
    private final StudentRepository studentRepository;

    public List<StudentProgressSummaryDto> getAllStudentProgressSummaries() {
        List<StudentProgressSummary> summaries = studentProgressSummaryRepository.findAll();
        List<StudentProgressSummaryDto> result = new ArrayList<>();
        
        for (StudentProgressSummary summary : summaries) {
            try {
                result.add(convertToDtoSafely(summary));
            } catch (Exception e) {
                log.error("Error processing StudentProgressSummary with id: " + summary.getId(), e);
                // 即使某个记录有问题也继续处理其他记录
            }
        }
        
        return result;
    }

    // 安全地转换实体为 DTO，处理可能的关联实体缺失问题
    private StudentProgressSummaryDto convertToDtoSafely(StudentProgressSummary summary) {
        try {
            return StudentProgressSummaryMapper.toDto(summary);
        } catch (Exception e) {
            log.warn("Error converting StudentProgressSummary to DTO for id: {}, error: {}", 
                     summary.getId(), e.getMessage());
            
            // 创建一个 DTO 并手动设置字段，避免访问可能缺失的关联实体
            StudentProgressSummaryDto dto = new StudentProgressSummaryDto();
            dto.setId(summary.getId());
            
            // 安全地设置学生 ID
            try {
                if (summary.getStudent() != null) {
                    dto.setStudentId(summary.getStudent().getStudentId());
                }
            } catch (Exception ex) {
                log.warn("Could not retrieve student for summary id: {}", summary.getId());
            }
            
            // 直接设置studyPlanId
            dto.setStudyPlanId(summary.getStudyPlanId());
            
            dto.setTotalEnrolledCourse(summary.getTotalEnrolledCourse());
            dto.setTotalCompletedCourse(summary.getTotalCompletedCourse());
            dto.setTotalCreditsEarned(summary.getTotalCreditsEarned());
            
            return dto;
        }
    }

    public StudentProgressSummaryDto getStudentProgressSummaryById(Long id) {
        StudentProgressSummary studentProgressSummary = studentProgressSummaryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("StudentProgressSummary not found with id: " + id));
        return convertToDtoSafely(studentProgressSummary);
    }

    public StudentProgressSummaryDto createStudentProgressSummary(StudentProgressSummaryDto studentProgressSummaryDto) {
        log.info("Creating student progress summary with studentId: {} and studyPlanId: {}", 
                 studentProgressSummaryDto.getStudentId(), studentProgressSummaryDto.getStudyPlanId());
        
        Student student = studentRepository.findById(studentProgressSummaryDto.getStudentId())
                .orElseThrow(() -> new EntityNotFoundException("Student not found with id: " + studentProgressSummaryDto.getStudentId()));

        StudentProgressSummary studentProgressSummary = StudentProgressSummaryMapper.toEntity(studentProgressSummaryDto, student);
        StudentProgressSummary savedStudentProgressSummary = studentProgressSummaryRepository.save(studentProgressSummary);
        return convertToDtoSafely(savedStudentProgressSummary);
    }

    public StudentProgressSummaryDto updateStudentProgressSummary(Long id, StudentProgressSummaryDto studentProgressSummaryDto) {
        log.info("Updating student progress summary with id: {}, studentId: {} and studyPlanId: {}", 
                 id, studentProgressSummaryDto.getStudentId(), studentProgressSummaryDto.getStudyPlanId());
        
        StudentProgressSummary existingStudentProgressSummary = studentProgressSummaryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("StudentProgressSummary not found with id: " + id));

        Student student = studentRepository.findById(studentProgressSummaryDto.getStudentId())
                .orElseThrow(() -> new EntityNotFoundException("Student not found with id: " + studentProgressSummaryDto.getStudentId()));

        existingStudentProgressSummary.setStudent(student);
        existingStudentProgressSummary.setStudyPlanId(studentProgressSummaryDto.getStudyPlanId());
        existingStudentProgressSummary.setTotalEnrolledCourse(studentProgressSummaryDto.getTotalEnrolledCourse() != null ? studentProgressSummaryDto.getTotalEnrolledCourse() : 0);
        existingStudentProgressSummary.setTotalCompletedCourse(studentProgressSummaryDto.getTotalCompletedCourse() != null ? studentProgressSummaryDto.getTotalCompletedCourse() : 0);
        existingStudentProgressSummary.setTotalCreditsEarned(studentProgressSummaryDto.getTotalCreditsEarned() != null ? studentProgressSummaryDto.getTotalCreditsEarned() : 0);

        StudentProgressSummary updatedStudentProgressSummary = studentProgressSummaryRepository.save(existingStudentProgressSummary);
        return convertToDtoSafely(updatedStudentProgressSummary);
    }

    public void deleteStudentProgressSummary(Long id) {
        StudentProgressSummary studentProgressSummary = studentProgressSummaryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("StudentProgressSummary not found with id: " + id));
        studentProgressSummaryRepository.delete(studentProgressSummary);
    }
}