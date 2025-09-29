package com.SBS_StudentServing_System.service.academic;

import com.SBS_StudentServing_System.dto.academic.StudentEnrollmentDto;
import com.SBS_StudentServing_System.mapping.StudentEnrollmentMapper;
import com.SBS_StudentServing_System.model.academic.StudentEnrollment;
import com.SBS_StudentServing_System.model.academic.StudyPlanCourse;
import com.SBS_StudentServing_System.model.student.Student;
import com.SBS_StudentServing_System.repository.academic.StudentEnrollmentRepository;
import com.SBS_StudentServing_System.repository.academic.StudyPlanCourseRepository;
import com.SBS_StudentServing_System.repository.student.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentEnrollmentService {

    @Autowired
    private StudentEnrollmentRepository studentEnrollmentRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private StudyPlanCourseRepository studyPlanCourseRepository;

    public List<StudentEnrollmentDto> getAllStudentEnrollments() {
        return studentEnrollmentRepository.findAll().stream()
                .map(StudentEnrollmentMapper::toDto)
                .collect(Collectors.toList());
    }

    public Optional<StudentEnrollmentDto> getStudentEnrollmentById(Long id) {
        return studentEnrollmentRepository.findById(id).map(StudentEnrollmentMapper::toDto);
    }

    public StudentEnrollmentDto createStudentEnrollment(StudentEnrollmentDto studentEnrollmentDto) {
        // 获取关联的学生和学习计划课程
        Student student = studentRepository.findById(studentEnrollmentDto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentEnrollmentDto.getStudentId()));
        
        StudyPlanCourse studyPlanCourse = studyPlanCourseRepository.findById(studentEnrollmentDto.getStudyPlanCourseId())
                .orElseThrow(() -> new RuntimeException("StudyPlanCourse not found with id: " + studentEnrollmentDto.getStudyPlanCourseId()));
        
        StudentEnrollment studentEnrollment = StudentEnrollmentMapper.toEntity(studentEnrollmentDto, student, studyPlanCourse);
        StudentEnrollment savedStudentEnrollment = studentEnrollmentRepository.save(studentEnrollment);
        return StudentEnrollmentMapper.toDto(savedStudentEnrollment);
    }

    public StudentEnrollmentDto updateStudentEnrollment(Long id, StudentEnrollmentDto studentEnrollmentDto) {
        if (studentEnrollmentRepository.existsById(id)) {
            // 获取关联的学生和学习计划课程
            Student student = studentRepository.findById(studentEnrollmentDto.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentEnrollmentDto.getStudentId()));
            
            StudyPlanCourse studyPlanCourse = studyPlanCourseRepository.findById(studentEnrollmentDto.getStudyPlanCourseId())
                    .orElseThrow(() -> new RuntimeException("StudyPlanCourse not found with id: " + studentEnrollmentDto.getStudyPlanCourseId()));
            
            StudentEnrollment studentEnrollment = StudentEnrollmentMapper.toEntity(studentEnrollmentDto, student, studyPlanCourse);
            studentEnrollment.setId(id); // 确保ID正确
            StudentEnrollment savedStudentEnrollment = studentEnrollmentRepository.save(studentEnrollment);
            return StudentEnrollmentMapper.toDto(savedStudentEnrollment);
        } else {
            throw new RuntimeException("StudentEnrollment not found with id: " + id);
        }
    }

    public void deleteStudentEnrollment(Long id) {
        studentEnrollmentRepository.deleteById(id);
    }
}