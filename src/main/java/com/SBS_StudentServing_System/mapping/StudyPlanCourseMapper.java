package com.SBS_StudentServing_System.mapping;

import com.SBS_StudentServing_System.dto.academic.StudyPlanCourseDto;
import com.SBS_StudentServing_System.model.academic.Course;
import com.SBS_StudentServing_System.model.academic.Semester;
import com.SBS_StudentServing_System.model.academic.StudyPlan;
import com.SBS_StudentServing_System.model.academic.StudyPlanCourse;

public class StudyPlanCourseMapper {
    public static StudyPlanCourseDto toDto(StudyPlanCourse entity) {
        StudyPlanCourseDto dto = new StudyPlanCourseDto();
        dto.setStudyPlanCourseId(entity.getStudyPlanCourseId());
        dto.setStudyPlanId(entity.getStudyPlan() != null ? entity.getStudyPlan().getStudyPlanId() : null);
        dto.setCourseId(entity.getCourse() != null ? entity.getCourse().getCourseId() : null);
        dto.setSemesterId(entity.getSemester() != null ? entity.getSemester().getSemesterId() : null);
        dto.setAssignmentDeadline(entity.getAssignmentDeadline());
        return dto;
    }

    public static StudyPlanCourse toEntity(StudyPlanCourseDto dto, StudyPlan studyPlan, Course course, Semester semester) {
        return StudyPlanCourse.builder()
                .studyPlanCourseId(dto.getStudyPlanCourseId())
                .studyPlan(studyPlan)
                .course(course)
                .semester(semester)
                .assignmentDeadline(dto.getAssignmentDeadline())
                .build();
    }
}
