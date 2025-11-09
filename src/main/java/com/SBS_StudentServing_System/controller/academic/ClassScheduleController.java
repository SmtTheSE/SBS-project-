package com.SBS_StudentServing_System.controller.academic;

import com.SBS_StudentServing_System.dto.academic.ClassScheduleDto;
import com.SBS_StudentServing_System.service.academic.ClassScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/academic/class-schedules")
public class ClassScheduleController {

    @Autowired
    private ClassScheduleService classScheduleService;

    @GetMapping
    public ResponseEntity<List<ClassScheduleDto>> getAllClassSchedules() {
        List<ClassScheduleDto> classSchedules = classScheduleService.getAllClassSchedules();
        return new ResponseEntity<>(classSchedules, HttpStatus.OK);
    }

    @GetMapping("/{classScheduleId}")
    public ResponseEntity<ClassScheduleDto> getClassScheduleById(@PathVariable String classScheduleId) {
        Optional<ClassScheduleDto> classSchedule = classScheduleService.getClassScheduleById(classScheduleId);
        return classSchedule.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<ClassScheduleDto> createClassSchedule(@RequestBody ClassScheduleDto classScheduleDto) {
        try {
            ClassScheduleDto createdClassSchedule = classScheduleService.createClassSchedule(classScheduleDto);
            return new ResponseEntity<>(createdClassSchedule, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{classScheduleId}")
    public ResponseEntity<ClassScheduleDto> updateClassSchedule(@PathVariable String classScheduleId, @RequestBody ClassScheduleDto classScheduleDto) {
        try {
            ClassScheduleDto updatedClassSchedule = classScheduleService.updateClassSchedule(classScheduleId, classScheduleDto);
            return new ResponseEntity<>(updatedClassSchedule, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{classScheduleId}")
    public ResponseEntity<HttpStatus> deleteClassSchedule(@PathVariable String classScheduleId) {
        try {
            classScheduleService.deleteClassSchedule(classScheduleId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}