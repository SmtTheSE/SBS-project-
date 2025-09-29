package com.SBS_StudentServing_System.mapping;

import com.SBS_StudentServing_System.dto.academic.StudentEnrollmentDto;
import com.SBS_StudentServing_System.model.academic.StudentEnrollment;
import com.SBS_StudentServing_System.model.academic.StudyPlanCourse;
import com.SBS_StudentServing_System.model.student.Student;

public class StudentEnrollmentMapper {
    public static StudentEnrollmentDto toDto(StudentEnrollment entity) {
        StudentEnrollmentDto dto = new StudentEnrollmentDto();
        dto.setId(entity.getId());
        dto.setStudentId(entity.getStudent() != null ? entity.getStudent().getStudentId() : null);
        dto.setStudyPlanCourseId(entity.getStudyPlanCourse() != null ? entity.getStudyPlanCourse().getStudyPlanCourseId() : null);
        dto.setEnrollmentStatus(entity.getEnrollmentStatus());
        dto.setCompletionStatus(entity.getCompletionStatus());
        dto.setExemptionStatus(entity.getExemptionStatus());
        return dto;
    }

    public static StudentEnrollment toEntity(StudentEnrollmentDto dto, Student student, StudyPlanCourse studyPlanCourse) {
        return StudentEnrollment.builder()
                .id(dto.getId())
                .student(student)
                .studyPlanCourse(studyPlanCourse)
                .enrollmentStatus(dto.getEnrollmentStatus())
                .completionStatus(dto.getCompletionStatus())
                .exemptionStatus(dto.getExemptionStatus())
                .build();
    }
}
