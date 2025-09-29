package com.SBS_StudentServing_System.mapping;

import com.SBS_StudentServing_System.dto.academic.Transcript_Issue_RequestDto;
import com.SBS_StudentServing_System.model.academic.TranscriptIssueRequest;
import com.SBS_StudentServing_System.model.academic.TranscriptRequest;
import com.SBS_StudentServing_System.model.admin.Admin;
import com.SBS_StudentServing_System.model.student.Student;

public class Transcript_Issue_RequestMapper {
    public static Transcript_Issue_RequestDto toDto(TranscriptIssueRequest entity) {
        Transcript_Issue_RequestDto dto = new Transcript_Issue_RequestDto();
        dto.setId(entity.getId());
        dto.setStudentId(entity.getStudent() != null ? entity.getStudent().getStudentId() : null);
        dto.setRequestId(entity.getRequest() != null ? entity.getRequest().getRequestId() : null);
        dto.setIssuedDate(entity.getIssuedDate());
        dto.setAdminId(entity.getAdmin() != null ? entity.getAdmin().getAdminId() : null);
        dto.setRequestStatus(entity.getRequestStatus());
        dto.setOptionalMessage(entity.getOptionalMessage());
        return dto;
    }

    public static TranscriptIssueRequest toEntity(TranscriptIssueRequest dto, Student student, TranscriptRequest request, Admin admin) {
        return TranscriptIssueRequest.builder()
                .id(dto.getId())
                .student(student)
                .request(request)
                .issuedDate(dto.getIssuedDate())
                .admin(admin)
                .requestStatus(dto.getRequestStatus())
                .optionalMessage(dto.getOptionalMessage())
                .build();
    }
}
