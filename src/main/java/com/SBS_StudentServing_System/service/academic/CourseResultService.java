package com.SBS_StudentServing_System.service.academic;

import com.SBS_StudentServing_System.dto.academic.CourseResultDto;
import com.SBS_StudentServing_System.mapping.CourseResultMapper;
import com.SBS_StudentServing_System.model.academic.CourseResult;
import com.SBS_StudentServing_System.model.academic.Grade;
import com.SBS_StudentServing_System.model.academic.StudyPlanCourse;
import com.SBS_StudentServing_System.model.student.Student;
import com.SBS_StudentServing_System.repository.academic.CourseResultRepository;
import com.SBS_StudentServing_System.repository.academic.GradeRepository;
import com.SBS_StudentServing_System.repository.academic.StudyPlanCourseRepository;
import com.SBS_StudentServing_System.repository.student.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseResultService {

    @Autowired
    private CourseResultRepository courseResultRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private StudyPlanCourseRepository studyPlanCourseRepository;
    
    @Autowired
    private GradeRepository gradeRepository;

    public List<CourseResultDto> getAllCourseResults() {
        return courseResultRepository.findAll().stream()
                .map(CourseResultMapper::toDto)
                .collect(Collectors.toList());
    }

    public Optional<CourseResultDto> getCourseResultById(Long id) {
        return courseResultRepository.findById(id).map(CourseResultMapper::toDto);
    }

    public CourseResultDto createCourseResult(CourseResultDto courseResultDto) {
        // 获取关联的学生、学习计划课程和成绩
        Student student = studentRepository.findById(courseResultDto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + courseResultDto.getStudentId()));
        
        StudyPlanCourse studyPlanCourse = studyPlanCourseRepository.findById(courseResultDto.getStudyPlanCourseId())
                .orElseThrow(() -> new RuntimeException("StudyPlanCourse not found with id: " + courseResultDto.getStudyPlanCourseId()));
        
        Grade grade = gradeRepository.findById(courseResultDto.getGradeName())
                .orElseThrow(() -> new RuntimeException("Grade not found with name: " + courseResultDto.getGradeName()));
        
        CourseResult courseResult = CourseResultMapper.toEntity(courseResultDto, student, studyPlanCourse, grade);
        CourseResult savedCourseResult = courseResultRepository.save(courseResult);
        return CourseResultMapper.toDto(savedCourseResult);
    }

    public CourseResultDto updateCourseResult(Long id, CourseResultDto courseResultDto) {
        if (courseResultRepository.existsById(id)) {
            // 获取关联的学生、学习计划课程和成绩
            Student student = studentRepository.findById(courseResultDto.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found with id: " + courseResultDto.getStudentId()));
            
            StudyPlanCourse studyPlanCourse = studyPlanCourseRepository.findById(courseResultDto.getStudyPlanCourseId())
                    .orElseThrow(() -> new RuntimeException("StudyPlanCourse not found with id: " + courseResultDto.getStudyPlanCourseId()));
            
            Grade grade = gradeRepository.findById(courseResultDto.getGradeName())
                    .orElseThrow(() -> new RuntimeException("Grade not found with name: " + courseResultDto.getGradeName()));
            
            CourseResult courseResult = CourseResultMapper.toEntity(courseResultDto, student, studyPlanCourse, grade);
            courseResult.setId(id); // 确保ID正确
            CourseResult savedCourseResult = courseResultRepository.save(courseResult);
            return CourseResultMapper.toDto(savedCourseResult);
        } else {
            throw new RuntimeException("CourseResult not found with id: " + id);
        }
    }

    public void deleteCourseResult(Long id) {
        courseResultRepository.deleteById(id);
    }
}