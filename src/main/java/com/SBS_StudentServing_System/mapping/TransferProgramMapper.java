package com.SBS_StudentServing_System.mapping;

import com.SBS_StudentServing_System.dto.admin.TransferProgramDto;
import com.SBS_StudentServing_System.model.admin.TransferProgram;

public class TransferProgramMapper {
    
    public static TransferProgramDto toDto(TransferProgram entity) {
        if (entity == null) {
            return null;
        }
        
        TransferProgramDto dto = new TransferProgramDto();
        dto.setTransferProgramId(entity.getTransferProgramId());
        dto.setAdminId(entity.getAdmin() != null ? entity.getAdmin().getAdminId() : null);
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setTransferCountry(entity.getTransferCountry());
        dto.setPartnerInstitutionId(entity.getPartnerInstitution() != null ? entity.getPartnerInstitution().getPartnerInstitutionId() : null);
        dto.setPartnerInstitutionName(entity.getPartnerInstitution() != null ? entity.getPartnerInstitution().getInstitutionName() : null);
        return dto;
    }
    
    public static TransferProgram toEntity(TransferProgramDto dto) {
        if (dto == null) {
            return null;
        }
        
        TransferProgram entity = new TransferProgram();
        entity.setTransferProgramId(dto.getTransferProgramId());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        entity.setTransferCountry(dto.getTransferCountry());
        return entity;
    }
}