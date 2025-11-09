package com.SBS_StudentServing_System.controller.studentinfo;

import com.SBS_StudentServing_System.dto.studentinfo.PartnerInstitutionDto;
import com.SBS_StudentServing_System.model.studentinfo.PartnerInstitution;
import com.SBS_StudentServing_System.service.studentinfo.PartnerInstitutionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/partner-institutions")
public class PartnerInstitutionController {

    private final PartnerInstitutionService partnerInstitutionService;

    public PartnerInstitutionController(PartnerInstitutionService partnerInstitutionService) {
        this.partnerInstitutionService = partnerInstitutionService;
    }

    @GetMapping
    public List<PartnerInstitutionDto> getAllPartnerInstitutions() {
        return partnerInstitutionService.getAllPartnerInstitutions();
    }

    @GetMapping("/{id}")
    public PartnerInstitutionDto getPartnerInstitutionById(@PathVariable String id) {
        return partnerInstitutionService.getPartnerInstitutionById(id);
    }

    @PostMapping
    public PartnerInstitutionDto createPartnerInstitution(@RequestBody PartnerInstitutionDto dto) {
        return partnerInstitutionService.createPartnerInstitution(dto);
    }

    @PutMapping("/{id}")
    public PartnerInstitutionDto updatePartnerInstitution(@PathVariable String id, @RequestBody PartnerInstitutionDto dto) {
        return partnerInstitutionService.updatePartnerInstitution(id, dto);
    }

    @DeleteMapping("/{id}")
    public boolean deletePartnerInstitution(@PathVariable String id) {
        return partnerInstitutionService.deletePartnerInstitution(id);
    }
}