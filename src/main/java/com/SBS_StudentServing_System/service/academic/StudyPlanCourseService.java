package com.SBS_StudentServing_System.service.academic;

import com.SBS_StudentServing_System.dto.academic.StudyPlanCourseDto;
import com.SBS_StudentServing_System.model.academic.StudyPlanCourse;
import com.SBS_StudentServing_System.model.academic.StudyPlan;
import com.SBS_StudentServing_System.model.academic.Course;
import com.SBS_StudentServing_System.model.academic.Semester;
import com.SBS_StudentServing_System.repository.academic.StudyPlanCourseRepository;
import com.SBS_StudentServing_System.repository.academic.StudyPlanRepository;
import com.SBS_StudentServing_System.repository.academic.CourseRepository;
import com.SBS_StudentServing_System.repository.academic.SemesterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudyPlanCourseService {

    @Autowired
    private StudyPlanCourseRepository studyPlanCourseRepository;

    @Autowired
    private StudyPlanRepository studyPlanRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private SemesterRepository semesterRepository;

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
        StudyPlanCourse studyPlanCourse = new StudyPlanCourse();
        studyPlanCourse.setStudyPlanCourseId(dto.getStudyPlanCourseId());
        
        // Set relationships
        Optional<StudyPlan> studyPlan = studyPlanRepository.findById(dto.getStudyPlanId());
        studyPlan.ifPresent(studyPlanCourse::setStudyPlan);
        
        Optional<Course> course = courseRepository.findById(dto.getCourseId());
        course.ifPresent(studyPlanCourse::setCourse);
        
        Optional<Semester> semester = semesterRepository.findById(dto.getSemesterId());
        semester.ifPresent(studyPlanCourse::setSemester);
        
        studyPlanCourse.setAssignmentDeadline(dto.getAssignmentDeadline());
        
        StudyPlanCourse saved = studyPlanCourseRepository.save(studyPlanCourse);
        return toDto(saved);
    }

    public StudyPlanCourseDto updateStudyPlanCourse(String id, StudyPlanCourseDto dto) {
        Optional<StudyPlanCourse> existing = studyPlanCourseRepository.findById(id);
        if (existing.isPresent()) {
            StudyPlanCourse studyPlanCourse = existing.get();
            
            // Update relationships
            Optional<StudyPlan> studyPlan = studyPlanRepository.findById(dto.getStudyPlanId());
            studyPlan.ifPresent(studyPlanCourse::setStudyPlan);
            
            Optional<Course> course = courseRepository.findById(dto.getCourseId());
            course.ifPresent(studyPlanCourse::setCourse);
            
            Optional<Semester> semester = semesterRepository.findById(dto.getSemesterId());
            semester.ifPresent(studyPlanCourse::setSemester);
            
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
        
        if (entity.getStudyPlan() != null) {
            dto.setStudyPlanId(entity.getStudyPlan().getStudyPlanId());
        }
        
        if (entity.getCourse() != null) {
            dto.setCourseId(entity.getCourse().getCourseId());
            dto.setCourseName(entity.getCourse().getCourseName());
        }
        
        if (entity.getSemester() != null) {
            dto.setSemesterId(entity.getSemester().getSemesterId());
        }
        
        dto.setAssignmentDeadline(entity.getAssignmentDeadline());
        return dto;
    }
}