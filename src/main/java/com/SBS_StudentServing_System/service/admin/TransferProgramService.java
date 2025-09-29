package com.SBS_StudentServing_System.service.admin;

import com.SBS_StudentServing_System.dto.admin.TransferProgramDto;
import com.SBS_StudentServing_System.mapping.TransferProgramMapper;
import com.SBS_StudentServing_System.model.admin.Admin;
import com.SBS_StudentServing_System.model.admin.TransferProgram;
import com.SBS_StudentServing_System.model.studentinfo.PartnerInstitution;
import com.SBS_StudentServing_System.repository.admin.AdminRepository;
import com.SBS_StudentServing_System.repository.admin.TransferProgramRepository;
import com.SBS_StudentServing_System.repository.studentinfo.PartnerInstitutionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TransferProgramService {

    private final TransferProgramRepository transferProgramRepository;
    private final AdminRepository adminRepository;
    private final PartnerInstitutionRepository partnerInstitutionRepository;

    public TransferProgramService(
            TransferProgramRepository transferProgramRepository,
            AdminRepository adminRepository,
            PartnerInstitutionRepository partnerInstitutionRepository) {
        this.transferProgramRepository = transferProgramRepository;
        this.adminRepository = adminRepository;
        this.partnerInstitutionRepository = partnerInstitutionRepository;
    }

    public List<TransferProgramDto> getAllTransferPrograms() {
        return transferProgramRepository.findAll().stream()
                .map(TransferProgramMapper::toDto)
                .collect(Collectors.toList());
    }

    public TransferProgramDto getTransferProgramById(String id) {
        Optional<TransferProgram> transferProgram = transferProgramRepository.findById(id);
        return transferProgram.map(TransferProgramMapper::toDto).orElse(null);
    }

    public TransferProgramDto createTransferProgram(TransferProgramDto dto) {
        TransferProgram entity = TransferProgramMapper.toEntity(dto);
        
        // Set creation and update timestamps
        LocalDateTime now = LocalDateTime.now();
        entity.setCreatedAt(now);
        entity.setUpdatedAt(now);
        
        // Set admin if provided
        if (dto.getAdminId() != null && !dto.getAdminId().isEmpty()) {
            Optional<Admin> admin = adminRepository.findById(dto.getAdminId());
            admin.ifPresent(entity::setAdmin);
        }
        
        // Set partner institution if provided
        if (dto.getPartnerInstitutionId() != null && !dto.getPartnerInstitutionId().isEmpty()) {
            Optional<PartnerInstitution> partnerInstitution = partnerInstitutionRepository.findById(dto.getPartnerInstitutionId());
            partnerInstitution.ifPresent(entity::setPartnerInstitution);
        }
        
        TransferProgram savedEntity = transferProgramRepository.save(entity);
        return TransferProgramMapper.toDto(savedEntity);
    }

    public TransferProgramDto updateTransferProgram(String id, TransferProgramDto dto) {
        Optional<TransferProgram> existingEntityOpt = transferProgramRepository.findById(id);
        if (existingEntityOpt.isEmpty()) {
            return null;
        }
        
        TransferProgram entity = existingEntityOpt.get();
        entity.setTransferProgramId(dto.getTransferProgramId());
        entity.setUpdatedAt(LocalDateTime.now());
        entity.setTransferCountry(dto.getTransferCountry());
        
        // Update admin if provided
        if (dto.getAdminId() != null && !dto.getAdminId().isEmpty()) {
            Optional<Admin> admin = adminRepository.findById(dto.getAdminId());
            admin.ifPresent(entity::setAdmin);
        }
        
        // Update partner institution if provided
        if (dto.getPartnerInstitutionId() != null && !dto.getPartnerInstitutionId().isEmpty()) {
            Optional<PartnerInstitution> partnerInstitution = partnerInstitutionRepository.findById(dto.getPartnerInstitutionId());
            partnerInstitution.ifPresent(entity::setPartnerInstitution);
        }
        
        TransferProgram updatedEntity = transferProgramRepository.save(entity);
        return TransferProgramMapper.toDto(updatedEntity);
    }

    public boolean deleteTransferProgram(String id) {
        if (transferProgramRepository.existsById(id)) {
            transferProgramRepository.deleteById(id);
            return true;
        }
        return false;
    }
}