package com.SBS_StudentServing_System.service.academic;

import com.SBS_StudentServing_System.dto.academic.GradeDto;
import com.SBS_StudentServing_System.mapping.GradeMapper;
import com.SBS_StudentServing_System.model.academic.Grade;
import com.SBS_StudentServing_System.repository.academic.GradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GradeService {

    @Autowired
    private GradeRepository gradeRepository;

    public List<GradeDto> getAllGrades() {
        return gradeRepository.findAll().stream()
                .map(GradeMapper::toDto)
                .collect(Collectors.toList());
    }

    public Optional<GradeDto> getGradeById(String gradeName) {
        return gradeRepository.findById(gradeName).map(GradeMapper::toDto);
    }

    public GradeDto createGrade(GradeDto gradeDto) {
        Grade grade = GradeMapper.toEntity(gradeDto);
        Grade savedGrade = gradeRepository.save(grade);
        return GradeMapper.toDto(savedGrade);
    }

    public GradeDto updateGrade(String gradeName, GradeDto gradeDto) {
        if (gradeRepository.existsById(gradeName)) {
            Grade grade = GradeMapper.toEntity(gradeDto);
            Grade savedGrade = gradeRepository.save(grade);
            return GradeMapper.toDto(savedGrade);
        } else {
            throw new RuntimeException("Grade not found with id: " + gradeName);
        }
    }

    public void deleteGrade(String gradeName) {
        gradeRepository.deleteById(gradeName);
    }
}