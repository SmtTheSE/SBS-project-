package com.SBS_StudentServing_System.controller.student;

import com.SBS_StudentServing_System.dto.studentinfo.StudentProfileResponse;
import com.SBS_StudentServing_System.service.studentinfo.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class StudentProfileController {

    private final StudentService studentService;

    @GetMapping("/profile")
    public ResponseEntity<StudentProfileResponse> getProfileInfo() {
        return ResponseEntity.ok(studentService.getLoggedInStudentInfo());
    }
}
