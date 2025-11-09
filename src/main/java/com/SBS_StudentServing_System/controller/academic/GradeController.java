package com.SBS_StudentServing_System.controller.academic;

import com.SBS_StudentServing_System.dto.academic.GradeDto;
import com.SBS_StudentServing_System.service.academic.GradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/academic/grades")
public class GradeController {

    @Autowired
    private GradeService gradeService;

    @GetMapping
    public ResponseEntity<List<GradeDto>> getAllGrades() {
        List<GradeDto> grades = gradeService.getAllGrades();
        return new ResponseEntity<>(grades, HttpStatus.OK);
    }

    @GetMapping("/{gradeName}")
    public ResponseEntity<GradeDto> getGradeById(@PathVariable String gradeName) {
        Optional<GradeDto> grade = gradeService.getGradeById(gradeName);
        return grade.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<GradeDto> createGrade(@RequestBody GradeDto gradeDto) {
        try {
            GradeDto createdGrade = gradeService.createGrade(gradeDto);
            return new ResponseEntity<>(createdGrade, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{gradeName}")
    public ResponseEntity<GradeDto> updateGrade(@PathVariable String gradeName, @RequestBody GradeDto gradeDto) {
        try {
            GradeDto updatedGrade = gradeService.updateGrade(gradeName, gradeDto);
            return new ResponseEntity<>(updatedGrade, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{gradeName}")
    public ResponseEntity<HttpStatus> deleteGrade(@PathVariable String gradeName) {
        try {
            gradeService.deleteGrade(gradeName);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}