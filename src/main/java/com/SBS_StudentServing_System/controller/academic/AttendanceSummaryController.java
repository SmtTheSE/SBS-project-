package com.SBS_StudentServing_System.controller.academic;

import com.SBS_StudentServing_System.dto.academic.AttendanceSummaryDto;
import com.SBS_StudentServing_System.service.academic.AttendanceSummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/academic/attendance-summaries")
@CrossOrigin(origins = "http://localhost:5173")
public class AttendanceSummaryController {

    @Autowired
    private AttendanceSummaryService attendanceSummaryService;

    @GetMapping
    public ResponseEntity<List<AttendanceSummaryDto>> getAllAttendanceSummaries() {
        List<AttendanceSummaryDto> attendanceSummaries = attendanceSummaryService.getAllAttendanceSummaries();
        return new ResponseEntity<>(attendanceSummaries, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttendanceSummaryDto> getAttendanceSummaryById(@PathVariable Long id) {
        Optional<AttendanceSummaryDto> attendanceSummary = attendanceSummaryService.getAttendanceSummaryById(id);
        return attendanceSummary.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<AttendanceSummaryDto> createAttendanceSummary(@RequestBody AttendanceSummaryDto attendanceSummaryDto) {
        try {
            AttendanceSummaryDto createdAttendanceSummary = attendanceSummaryService.createAttendanceSummary(attendanceSummaryDto);
            return new ResponseEntity<>(createdAttendanceSummary, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<AttendanceSummaryDto> updateAttendanceSummary(@PathVariable Long id, @RequestBody AttendanceSummaryDto attendanceSummaryDto) {
        try {
            AttendanceSummaryDto updatedAttendanceSummary = attendanceSummaryService.updateAttendanceSummary(id, attendanceSummaryDto);
            return new ResponseEntity<>(updatedAttendanceSummary, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteAttendanceSummary(@PathVariable Long id) {
        try {
            attendanceSummaryService.deleteAttendanceSummary(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}