package com.SBS_StudentServing_System.controller.academic;

import com.SBS_StudentServing_System.dto.academic.DailyAttendanceDto;
import com.SBS_StudentServing_System.service.academic.DailyAttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/academic/daily-attendances")
public class DailyAttendanceController {

    @Autowired
    private DailyAttendanceService dailyAttendanceService;

    @GetMapping
    public ResponseEntity<List<DailyAttendanceDto>> getAllDailyAttendances() {
        List<DailyAttendanceDto> dailyAttendances = dailyAttendanceService.getAllDailyAttendances();
        return new ResponseEntity<>(dailyAttendances, HttpStatus.OK);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<DailyAttendanceDto>> getDailyAttendanceByStudentId(@PathVariable String studentId) {
        List<DailyAttendanceDto> dailyAttendances = dailyAttendanceService.getDailyAttendanceByStudentId(studentId);
        return new ResponseEntity<>(dailyAttendances, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<DailyAttendanceDto> createDailyAttendance(@RequestBody DailyAttendanceDto dailyAttendanceDto) {
        try {
            DailyAttendanceDto createdDailyAttendance = dailyAttendanceService.createDailyAttendance(dailyAttendanceDto);
            return new ResponseEntity<>(createdDailyAttendance, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{studentId}/{classScheduleId}")
    public ResponseEntity<DailyAttendanceDto> updateDailyAttendance(
            @PathVariable String studentId, 
            @PathVariable String classScheduleId, 
            @RequestBody DailyAttendanceDto dailyAttendanceDto) {
        try {
            DailyAttendanceDto updatedDailyAttendance = dailyAttendanceService.updateDailyAttendance(studentId, classScheduleId, dailyAttendanceDto);
            return new ResponseEntity<>(updatedDailyAttendance, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{studentId}/{classScheduleId}")
    public ResponseEntity<HttpStatus> deleteDailyAttendance(
            @PathVariable String studentId, 
            @PathVariable String classScheduleId) {
        try {
            dailyAttendanceService.deleteDailyAttendance(studentId, classScheduleId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}