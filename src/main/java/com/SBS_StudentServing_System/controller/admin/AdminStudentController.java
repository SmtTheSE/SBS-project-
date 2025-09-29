package com.SBS_StudentServing_System.controller.admin;

import com.SBS_StudentServing_System.dto.student.StudentCreateDto;
import com.SBS_StudentServing_System.dto.student.StudentDto;
import com.SBS_StudentServing_System.model.student.related.City;
import com.SBS_StudentServing_System.model.student.related.Ward;
import com.SBS_StudentServing_System.service.student.StudentService;
import com.SBS_StudentServing_System.repository.student.CityRepository;
import com.SBS_StudentServing_System.repository.student.WardRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/students")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminStudentController {

    private final StudentService studentService;
    private final CityRepository cityRepository;
    private final WardRepository wardRepository;

    public AdminStudentController(StudentService studentService, CityRepository cityRepository, WardRepository wardRepository) {
        this.studentService = studentService;
        this.cityRepository = cityRepository;
        this.wardRepository = wardRepository;
    }

    @GetMapping
    public List<StudentDto> getAllStudents() {
        return studentService.getAllStudents();
    }

    @GetMapping("/{id}")
    public StudentDto getStudent(@PathVariable("id") String studentId) {
        return studentService.getStudent(studentId);
    }

    @PostMapping
    public StudentDto createStudent(@RequestBody StudentCreateDto dto) {
        return studentService.createStudent(dto);
    }

    @PutMapping("/{id}")
    public StudentDto updateStudent(@PathVariable("id") String studentId, @RequestBody StudentCreateDto dto) {
        return studentService.updateStudent(studentId, dto);
    }

    @DeleteMapping("/{id}")
    public boolean deleteStudent(@PathVariable("id") String studentId) {
        return studentService.deleteStudent(studentId);
    }

    @PutMapping("/{id}/toggle-status")
    public StudentDto toggleAccountStatus(@PathVariable("id") String studentId) {
        return studentService.toggleAccountStatus(studentId);
    }
    
    @GetMapping("/cities")
    public List<City> getAllCities() {
        return cityRepository.findAll();
    }
    
    @GetMapping("/wards")
    public List<Ward> getAllWards() {
        return wardRepository.findAll();
    }
    
    @PostMapping("/cities")
    public City createCity(@RequestBody City city) {
        return cityRepository.save(city);
    }
    
    @PostMapping("/wards")
    public Ward createWard(@RequestBody Ward ward) {
        return wardRepository.save(ward);
    }
}