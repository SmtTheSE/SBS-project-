package com.SBS_StudentServing_System.service.studentinfo;

import com.SBS_StudentServing_System.dto.studentinfo.DimScholarshipDto;
import com.SBS_StudentServing_System.dto.studentinfo.StudentScholarshipDto;
import com.SBS_StudentServing_System.model.studentinfo.Scholarship;
import com.SBS_StudentServing_System.model.studentinfo.StudentScholarship;
import com.SBS_StudentServing_System.repository.student.DimScholarshipRepository;
import com.SBS_StudentServing_System.repository.student.StudentScholarshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DimScholarshipService {

    @Autowired
    private DimScholarshipRepository dimScholarshipRepository;

    public List<DimScholarshipDto> getAll() {
        return dimScholarshipRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public DimScholarshipDto getById(String id) {
        return dimScholarshipRepository.findById(id)
                .map(this::toDto)
                .orElse(null);
    }

    public DimScholarshipDto save(DimScholarshipDto dto) {
        Scholarship entity = toEntity(dto);
        Scholarship saved = dimScholarshipRepository.save(entity);
        return toDto(saved);
    }

    public void delete(String id) {
        dimScholarshipRepository.deleteById(id);
    }

    // Conversion methods
    private DimScholarshipDto toDto(Scholarship entity) {
        DimScholarshipDto dto = new DimScholarshipDto();
        dto.setScholarshipId(entity.getScholarshipId());
        dto.setScholarshipType(entity.getScholarshipType());
        dto.setAmount(entity.getAmount());
        dto.setDescription(entity.getDescription());
        return dto;
    }

    private Scholarship toEntity(DimScholarshipDto dto) {
        Scholarship entity = new Scholarship();
        entity.setScholarshipId(dto.getScholarshipId());
        entity.setScholarshipType(dto.getScholarshipType());
        entity.setAmount((float) dto.getAmount());
        entity.setDescription(dto.getDescription());
        return entity;
    }
}