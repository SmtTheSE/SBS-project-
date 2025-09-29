package com.SBS_StudentServing_System.service.studentinfo;

import com.SBS_StudentServing_System.dto.studentinfo.PartnerInstitutionDto;
import com.SBS_StudentServing_System.mapping.PartnerInstitutionMapper;
import com.SBS_StudentServing_System.model.studentinfo.PartnerInstitution;
import com.SBS_StudentServing_System.repository.studentinfo.PartnerInstitutionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PartnerInstitutionService {

    private final PartnerInstitutionRepository partnerInstitutionRepository;

    public PartnerInstitutionService(PartnerInstitutionRepository partnerInstitutionRepository) {
        this.partnerInstitutionRepository = partnerInstitutionRepository;
    }

    public List<PartnerInstitutionDto> getAllPartnerInstitutions() {
        return partnerInstitutionRepository.findAll().stream()
                .map(PartnerInstitutionMapper::toDto)
                .collect(Collectors.toList());
    }

    public PartnerInstitutionDto getPartnerInstitutionById(String id) {
        Optional<PartnerInstitution> partnerInstitution = partnerInstitutionRepository.findById(id);
        return partnerInstitution.map(PartnerInstitutionMapper::toDto).orElse(null);
    }

    public PartnerInstitutionDto createPartnerInstitution(PartnerInstitutionDto dto) {
        PartnerInstitution entity = PartnerInstitutionMapper.toEntity(dto);
        PartnerInstitution savedEntity = partnerInstitutionRepository.save(entity);
        return PartnerInstitutionMapper.toDto(savedEntity);
    }

    public PartnerInstitutionDto updatePartnerInstitution(String id, PartnerInstitutionDto dto) {
        Optional<PartnerInstitution> existingEntityOpt = partnerInstitutionRepository.findById(id);
        if (existingEntityOpt.isEmpty()) {
            return null;
        }
        
        PartnerInstitution entity = existingEntityOpt.get();
        entity.setInstitutionName(dto.getInstitutionName());
        entity.setWebsiteUrl(dto.getWebsiteUrl());
        entity.setEmail(dto.getEmail());
        
        PartnerInstitution updatedEntity = partnerInstitutionRepository.save(entity);
        return PartnerInstitutionMapper.toDto(updatedEntity);
    }

    public boolean deletePartnerInstitution(String id) {
        if (partnerInstitutionRepository.existsById(id)) {
            partnerInstitutionRepository.deleteById(id);
            return true;
        }
        return false;
    }
}