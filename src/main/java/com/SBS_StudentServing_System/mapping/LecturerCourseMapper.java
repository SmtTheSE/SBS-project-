package com.SBS_StudentServing_System.mapping;


import com.SBS_StudentServing_System.dto.academic.LecturerCourseDto;
import com.SBS_StudentServing_System.model.academic.ClassSchedule;
import com.SBS_StudentServing_System.model.academic.LecturerCourse;
import com.SBS_StudentServing_System.model.academic.Semester;
import com.SBS_StudentServing_System.model.academic.StudyPlanCourse;
import com.SBS_StudentServing_System.model.lecturer.Lecturer;

public class LecturerCourseMapper {
    public static LecturerCourseDto toDto(LecturerCourse entity) {
        LecturerCourseDto dto = new LecturerCourseDto();
        dto.setId(entity.getId());
        dto.setLecturerId(entity.getLecturer() != null ? entity.getLecturer().getLecturerId() : null);
        dto.setStudyPlanCourseId(entity.getStudyPlanCourse() != null ? entity.getStudyPlanCourse().getStudyPlanCourseId() : null);
        dto.setSemesterId(entity.getSemester() != null ? entity.getSemester().getSemesterId() : null);
        dto.setClassScheduleId(entity.getClassSchedule() != null ? entity.getClassSchedule().getClassScheduleId() : null);
        dto.setTotalAssignedCourse(entity.getTotalAssignedCourse());
        return dto;
    }

    public static LecturerCourse toEntity(LecturerCourseDto dto, Lecturer lecturer, StudyPlanCourse studyPlanCourse, Semester semester, ClassSchedule classSchedule) {
        return LecturerCourse.builder()
                .id(dto.getId())
                .lecturer(lecturer)
                .studyPlanCourse(studyPlanCourse)
                .semester(semester)
                .classSchedule(classSchedule)
                .totalAssignedCourse(dto.getTotalAssignedCourse())
                .build();
    }
}
