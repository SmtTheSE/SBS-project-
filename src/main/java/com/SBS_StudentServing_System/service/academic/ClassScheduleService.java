package com.SBS_StudentServing_System.service.academic;

import com.SBS_StudentServing_System.dto.academic.ClassScheduleDto;
import com.SBS_StudentServing_System.mapping.ClassScheduleMapper;
import com.SBS_StudentServing_System.model.academic.ClassSchedule;
import com.SBS_StudentServing_System.model.academic.StudyPlanCourse;
import com.SBS_StudentServing_System.repository.academic.ClassScheduleRepository;
import com.SBS_StudentServing_System.repository.academic.StudyPlanCourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ClassScheduleService {

    @Autowired
    private ClassScheduleRepository classScheduleRepository;
    
    @Autowired
    private StudyPlanCourseRepository studyPlanCourseRepository;

    public List<ClassScheduleDto> getAllClassSchedules() {
        return classScheduleRepository.findAll().stream()
                .map(ClassScheduleMapper::toDto)
                .collect(Collectors.toList());
    }

    public Optional<ClassScheduleDto> getClassScheduleById(String classScheduleId) {
        return classScheduleRepository.findById(classScheduleId).map(ClassScheduleMapper::toDto);
    }

    public ClassScheduleDto createClassSchedule(ClassScheduleDto classScheduleDto) {
        // 获取关联的StudyPlanCourse
        StudyPlanCourse studyPlanCourse = studyPlanCourseRepository.findById(classScheduleDto.getStudyPlanCourseId())
                .orElseThrow(() -> new RuntimeException("StudyPlanCourse not found with id: " + classScheduleDto.getStudyPlanCourseId()));
        
        ClassSchedule classSchedule = ClassScheduleMapper.toEntity(classScheduleDto, studyPlanCourse);
        ClassSchedule savedClassSchedule = classScheduleRepository.save(classSchedule);
        return ClassScheduleMapper.toDto(savedClassSchedule);
    }

    public ClassScheduleDto updateClassSchedule(String classScheduleId, ClassScheduleDto classScheduleDto) {
        if (classScheduleRepository.existsById(classScheduleId)) {
            // 获取关联的StudyPlanCourse
            StudyPlanCourse studyPlanCourse = studyPlanCourseRepository.findById(classScheduleDto.getStudyPlanCourseId())
                    .orElseThrow(() -> new RuntimeException("StudyPlanCourse not found with id: " + classScheduleDto.getStudyPlanCourseId()));
            
            ClassSchedule classSchedule = ClassScheduleMapper.toEntity(classScheduleDto, studyPlanCourse);
            ClassSchedule savedClassSchedule = classScheduleRepository.save(classSchedule);
            return ClassScheduleMapper.toDto(savedClassSchedule);
        } else {
            throw new RuntimeException("ClassSchedule not found with id: " + classScheduleId);
        }
    }

    public void deleteClassSchedule(String classScheduleId) {
        classScheduleRepository.deleteById(classScheduleId);
    }
}