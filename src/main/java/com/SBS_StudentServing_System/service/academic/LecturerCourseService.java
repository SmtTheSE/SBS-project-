package com.SBS_StudentServing_System.service.academic;

import com.SBS_StudentServing_System.dto.academic.LecturerCourseDto;
import com.SBS_StudentServing_System.mapping.LecturerCourseMapper;
import com.SBS_StudentServing_System.model.academic.*;
import com.SBS_StudentServing_System.model.lecturer.Lecturer;
import com.SBS_StudentServing_System.repository.academic.*;
import com.SBS_StudentServing_System.repository.lecturer.LecturerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LecturerCourseService {

    private final LecturerCourseRepository lecturerCourseRepository;
    private final LecturerRepository lecturerRepository;
    private final StudyPlanCourseRepository studyPlanCourseRepository;
    private final SemesterRepository semesterRepository;
    private final ClassScheduleRepository classScheduleRepository;

    public LecturerCourseService(
            LecturerCourseRepository lecturerCourseRepository,
            LecturerRepository lecturerRepository,
            StudyPlanCourseRepository studyPlanCourseRepository,
            SemesterRepository semesterRepository,
            ClassScheduleRepository classScheduleRepository) {
        this.lecturerCourseRepository = lecturerCourseRepository;
        this.lecturerRepository = lecturerRepository;
        this.studyPlanCourseRepository = studyPlanCourseRepository;
        this.semesterRepository = semesterRepository;
        this.classScheduleRepository = classScheduleRepository;
    }

    public List<LecturerCourseDto> getAllLecturerCourses() {
        return lecturerCourseRepository.findAll().stream()
                .map(LecturerCourseMapper::toDto)
                .collect(Collectors.toList());
    }

    public LecturerCourseDto getLecturerCourse(Long id) {
        Optional<LecturerCourse> lecturerCourseOpt = lecturerCourseRepository.findById(id);
        return lecturerCourseOpt.map(LecturerCourseMapper::toDto).orElse(null);
    }

    public LecturerCourseDto createLecturerCourse(LecturerCourseDto dto) {
        LecturerCourse entity = convertToEntity(dto);
        LecturerCourse savedEntity = lecturerCourseRepository.save(entity);
        return LecturerCourseMapper.toDto(savedEntity);
    }

    public LecturerCourseDto updateLecturerCourse(Long id, LecturerCourseDto dto) {
        Optional<LecturerCourse> lecturerCourseOpt = lecturerCourseRepository.findById(id);
        if (lecturerCourseOpt.isEmpty()) {
            return null;
        }

        LecturerCourse entity = convertToEntity(dto);
        entity.setId(id); // Ensure we're updating the correct entity
        LecturerCourse updatedEntity = lecturerCourseRepository.save(entity);
        return LecturerCourseMapper.toDto(updatedEntity);
    }

    public boolean deleteLecturerCourse(Long id) {
        Optional<LecturerCourse> lecturerCourseOpt = lecturerCourseRepository.findById(id);
        if (lecturerCourseOpt.isEmpty()) {
            return false;
        }

        lecturerCourseRepository.delete(lecturerCourseOpt.get());
        return true;
    }

    private LecturerCourse convertToEntity(LecturerCourseDto dto) {
        Lecturer lecturer = null;
        if (dto.getLecturerId() != null && !dto.getLecturerId().isEmpty()) {
            Optional<Lecturer> lecturerOpt = lecturerRepository.findById(dto.getLecturerId());
            if (lecturerOpt.isPresent()) {
                lecturer = lecturerOpt.get();
            }
        }

        StudyPlanCourse studyPlanCourse = null;
        if (dto.getStudyPlanCourseId() != null && !dto.getStudyPlanCourseId().isEmpty()) {
            Optional<StudyPlanCourse> studyPlanCourseOpt = studyPlanCourseRepository.findById(dto.getStudyPlanCourseId());
            if (studyPlanCourseOpt.isPresent()) {
                studyPlanCourse = studyPlanCourseOpt.get();
            }
        }

        Semester semester = null;
        if (dto.getSemesterId() != null && !dto.getSemesterId().isEmpty()) {
            Optional<Semester> semesterOpt = semesterRepository.findById(dto.getSemesterId());
            if (semesterOpt.isPresent()) {
                semester = semesterOpt.get();
            }
        }

        ClassSchedule classSchedule = null;
        if (dto.getClassScheduleId() != null && !dto.getClassScheduleId().isEmpty()) {
            Optional<ClassSchedule> classScheduleOpt = classScheduleRepository.findById(dto.getClassScheduleId());
            if (classScheduleOpt.isPresent()) {
                classSchedule = classScheduleOpt.get();
            }
        }

        return LecturerCourseMapper.toEntity(dto, lecturer, studyPlanCourse, semester, classSchedule);
    }
}