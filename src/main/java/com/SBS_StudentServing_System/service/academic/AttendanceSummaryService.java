package com.SBS_StudentServing_System.service.academic;

import com.SBS_StudentServing_System.dto.academic.AttendanceSummaryDto;
import com.SBS_StudentServing_System.mapping.AttendanceSummaryMapper;
import com.SBS_StudentServing_System.model.academic.AttendanceSummary;
import com.SBS_StudentServing_System.model.academic.StudyPlanCourse;
import com.SBS_StudentServing_System.model.student.Student;
import com.SBS_StudentServing_System.repository.academic.AttendanceSummaryRepository;
import com.SBS_StudentServing_System.repository.academic.StudyPlanCourseRepository;
import com.SBS_StudentServing_System.repository.student.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AttendanceSummaryService {

    @Autowired
    private AttendanceSummaryRepository attendanceSummaryRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private StudyPlanCourseRepository studyPlanCourseRepository;

    public List<AttendanceSummaryDto> getAllAttendanceSummaries() {
        return attendanceSummaryRepository.findAll().stream()
                .map(AttendanceSummaryMapper::toDto)
                .collect(Collectors.toList());
    }

    public Optional<AttendanceSummaryDto> getAttendanceSummaryById(Long id) {
        return attendanceSummaryRepository.findById(id).map(AttendanceSummaryMapper::toDto);
    }

    public AttendanceSummaryDto createAttendanceSummary(AttendanceSummaryDto attendanceSummaryDto) {
        // 获取关联的学生和学习计划课程
        Student student = studentRepository.findById(attendanceSummaryDto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + attendanceSummaryDto.getStudentId()));
        
        StudyPlanCourse studyPlanCourse = studyPlanCourseRepository.findById(attendanceSummaryDto.getStudyPlanCourseId())
                .orElseThrow(() -> new RuntimeException("StudyPlanCourse not found with id: " + attendanceSummaryDto.getStudyPlanCourseId()));
        
        AttendanceSummary attendanceSummary = AttendanceSummaryMapper.toEntity(attendanceSummaryDto, student, studyPlanCourse);
        AttendanceSummary savedAttendanceSummary = attendanceSummaryRepository.save(attendanceSummary);
        return AttendanceSummaryMapper.toDto(savedAttendanceSummary);
    }

    public AttendanceSummaryDto updateAttendanceSummary(Long id, AttendanceSummaryDto attendanceSummaryDto) {
        if (attendanceSummaryRepository.existsById(id)) {
            // 获取关联的学生和学习计划课程
            Student student = studentRepository.findById(attendanceSummaryDto.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found with id: " + attendanceSummaryDto.getStudentId()));
            
            StudyPlanCourse studyPlanCourse = studyPlanCourseRepository.findById(attendanceSummaryDto.getStudyPlanCourseId())
                    .orElseThrow(() -> new RuntimeException("StudyPlanCourse not found with id: " + attendanceSummaryDto.getStudyPlanCourseId()));
            
            AttendanceSummary attendanceSummary = AttendanceSummaryMapper.toEntity(attendanceSummaryDto, student, studyPlanCourse);
            attendanceSummary.setId(id); // 确保ID正确
            AttendanceSummary savedAttendanceSummary = attendanceSummaryRepository.save(attendanceSummary);
            return AttendanceSummaryMapper.toDto(savedAttendanceSummary);
        } else {
            throw new RuntimeException("AttendanceSummary not found with id: " + id);
        }
    }

    public void deleteAttendanceSummary(Long id) {
        attendanceSummaryRepository.deleteById(id);
    }
}