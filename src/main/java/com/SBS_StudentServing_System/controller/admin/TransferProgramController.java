package com.SBS_StudentServing_System.controller.admin;

import com.SBS_StudentServing_System.dto.admin.TransferProgramDto;
import com.SBS_StudentServing_System.service.admin.TransferProgramService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/transfer-programs")
public class TransferProgramController {

    private final TransferProgramService transferProgramService;

    public TransferProgramController(TransferProgramService transferProgramService) {
        this.transferProgramService = transferProgramService;
    }

    @GetMapping
    public List<TransferProgramDto> getAllTransferPrograms() {
        return transferProgramService.getAllTransferPrograms();
    }

    @GetMapping("/{id}")
    public TransferProgramDto getTransferProgramById(@PathVariable String id) {
        return transferProgramService.getTransferProgramById(id);
    }

    @PostMapping
    public TransferProgramDto createTransferProgram(@RequestBody TransferProgramDto dto) {
        return transferProgramService.createTransferProgram(dto);
    }

    @PutMapping("/{id}")
    public TransferProgramDto updateTransferProgram(@PathVariable String id, @RequestBody TransferProgramDto dto) {
        return transferProgramService.updateTransferProgram(id, dto);
    }

    @DeleteMapping("/{id}")
    public boolean deleteTransferProgram(@PathVariable String id) {
        return transferProgramService.deleteTransferProgram(id);
    }
}