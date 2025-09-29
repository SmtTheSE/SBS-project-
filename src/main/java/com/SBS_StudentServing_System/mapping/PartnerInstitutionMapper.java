package com.SBS_StudentServing_System.mapping;

import com.SBS_StudentServing_System.dto.studentinfo.PartnerInstitutionDto;
import com.SBS_StudentServing_System.model.studentinfo.PartnerInstitution;

public class PartnerInstitutionMapper {
    
    public static PartnerInstitutionDto toDto(PartnerInstitution entity) {
        if (entity == null) {
            return null;
        }
        
        PartnerInstitutionDto dto = new PartnerInstitutionDto();
        dto.setPartnerInstitutionId(entity.getPartnerInstitutionId());
        dto.setInstitutionName(entity.getInstitutionName());
        dto.setWebsiteUrl(entity.getWebsiteUrl());
        dto.setEmail(entity.getEmail());
        return dto;
    }
    
    public static PartnerInstitution toEntity(PartnerInstitutionDto dto) {
        if (dto == null) {
            return null;
        }
        
        PartnerInstitution entity = new PartnerInstitution();
        entity.setPartnerInstitutionId(dto.getPartnerInstitutionId());
        entity.setInstitutionName(dto.getInstitutionName());
        entity.setWebsiteUrl(dto.getWebsiteUrl());
        entity.setEmail(dto.getEmail());
        return entity;
    }
}