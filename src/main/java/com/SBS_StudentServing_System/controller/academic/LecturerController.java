package com.SBS_StudentServing_System.controller.academic;

import com.SBS_StudentServing_System.dto.academic.LecturerCreateDto;
import com.SBS_StudentServing_System.dto.academic.LecturerDto;
import com.SBS_StudentServing_System.service.academic.LecturerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/lecturers")
public class LecturerController {

    private final LecturerService lecturerService;

    public LecturerController(LecturerService lecturerService) {
        this.lecturerService = lecturerService;
    }

    @GetMapping
    public List<LecturerDto> getAllLecturers() {
        return lecturerService.getAllLecturers();
    }

    @GetMapping("/{id}")
    public LecturerDto getLecturer(@PathVariable("id") String lecturerId) {
        return lecturerService.getLecturer(lecturerId);
    }

    @PostMapping
    public LecturerDto createLecturer(@RequestBody LecturerCreateDto dto) {
        return lecturerService.createLecturer(dto);
    }

    @PutMapping("/{id}")
    public LecturerDto updateLecturer(@PathVariable("id") String lecturerId, @RequestBody LecturerCreateDto dto) {
        return lecturerService.updateLecturer(lecturerId, dto);
    }

    @DeleteMapping("/{id}")
    public boolean deleteLecturer(@PathVariable("id") String lecturerId) {
        return lecturerService.deleteLecturer(lecturerId);
    }
}