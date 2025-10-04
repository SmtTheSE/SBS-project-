package com.SBS_StudentServing_System.service.academic;

import com.SBS_StudentServing_System.dto.academic.StudyPlanCourseDto;
import com.SBS_StudentServing_System.model.academic.StudyPlanCourse;
import com.SBS_StudentServing_System.repository.academic.StudyPlanCourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudyPlanCourseService {

    @Autowired
    private StudyPlanCourseRepository studyPlanCourseRepository;

    public List<StudyPlanCourseDto> getAllStudyPlanCourses() {
        return studyPlanCourseRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public StudyPlanCourseDto getStudyPlanCourseById(String id) {
        Optional<StudyPlanCourse> studyPlanCourse = studyPlanCourseRepository.findById(id);
        return studyPlanCourse.map(this::toDto).orElse(null);
    }

    public StudyPlanCourseDto createStudyPlanCourse(StudyPlanCourseDto dto) {
        StudyPlanCourse studyPlanCourse = toEntity(dto);
        StudyPlanCourse saved = studyPlanCourseRepository.save(studyPlanCourse);
        return toDto(saved);
    }

    public StudyPlanCourseDto updateStudyPlanCourse(String id, StudyPlanCourseDto dto) {
        Optional<StudyPlanCourse> existing = studyPlanCourseRepository.findById(id);
        if (existing.isPresent()) {
            StudyPlanCourse studyPlanCourse = existing.get();
            
            // Update fields
            studyPlanCourse.setStudyPlanId(dto.getStudyPlanId());
            studyPlanCourse.setCourseId(dto.getCourseId());
            studyPlanCourse.setSemesterId(dto.getSemesterId());
            studyPlanCourse.setAssignmentDeadline(dto.getAssignmentDeadline());
            
            StudyPlanCourse saved = studyPlanCourseRepository.save(studyPlanCourse);
            return toDto(saved);
        }
        return null;
    }

    public boolean deleteStudyPlanCourse(String id) {
        if (studyPlanCourseRepository.existsById(id)) {
            studyPlanCourseRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private StudyPlanCourseDto toDto(StudyPlanCourse entity) {
        StudyPlanCourseDto dto = new StudyPlanCourseDto();
        dto.setStudyPlanCourseId(entity.getStudyPlanCourseId());
        dto.setStudyPlanId(entity.getStudyPlanId());
        dto.setCourseId(entity.getCourseId());
        dto.setSemesterId(entity.getSemesterId());
        dto.setAssignmentDeadline(entity.getAssignmentDeadline());
        return dto;
    }
    
    private StudyPlanCourse toEntity(StudyPlanCourseDto dto) {
        StudyPlanCourse entity = new StudyPlanCourse();
        entity.setStudyPlanCourseId(dto.getStudyPlanCourseId());
        entity.setStudyPlanId(dto.getStudyPlanId());
        entity.setCourseId(dto.getCourseId());
        entity.setSemesterId(dto.getSemesterId());
        entity.setAssignmentDeadline(dto.getAssignmentDeadline());
        return entity;
    }
}