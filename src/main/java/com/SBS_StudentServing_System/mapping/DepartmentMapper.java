package com.SBS_StudentServing_System.mapping;

import com.SBS_StudentServing_System.dto.academic.DepartmentDto;
import com.SBS_StudentServing_System.model.academic.Department;

public class DepartmentMapper {
    public static DepartmentDto toDto(Department entity) {
        DepartmentDto dto = new DepartmentDto();
        dto.setDepartmentId(entity.getDepartmentId());
        dto.setDepartmentName(entity.getDepartmentName());
        dto.setHeadOfDepartment(entity.getHeadOfDepartment());
        dto.setEmail(entity.getEmail());
        return dto;
    }

    public static Department toEntity(DepartmentDto dto) {
        return Department.builder()
                .departmentId(dto.getDepartmentId())
                .departmentName(dto.getDepartmentName())
                .headOfDepartment(dto.getHeadOfDepartment())
                .email(dto.getEmail())
                .build();
    }
}
