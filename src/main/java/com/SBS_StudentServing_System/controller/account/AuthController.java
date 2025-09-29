package com.SBS_StudentServing_System.controller.account;

import com.SBS_StudentServing_System.dto.account.LoginRequestDto;
import com.SBS_StudentServing_System.dto.account.LoginResponseDto;
import com.SBS_StudentServing_System.model.account.LoginAccount;
import com.SBS_StudentServing_System.model.student.Student;
import com.SBS_StudentServing_System.model.admin.Admin;
import com.SBS_StudentServing_System.repository.student.StudentRepository;
import com.SBS_StudentServing_System.repository.admin.AdminRepository;
import com.SBS_StudentServing_System.service.account.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public LoginResponseDto login(@RequestBody LoginRequestDto loginRequest) {
        // Try student login
        Student student = studentRepository.findByStudentEmail(loginRequest.getEmail()).orElse(null);
        if (student != null && student.getLoginAccount() != null) {
            LoginAccount account = student.getLoginAccount();
            if (isPasswordValid(loginRequest.getPassword(), account.getPassword())) {
                String token = jwtUtil.generateToken(account.getAccountId(), account.getRole());
                return new LoginResponseDto(token, account.getRole(), account.getAccountId());
            }
        }

        // Try admin login
        Admin admin = adminRepository.findByEmail(loginRequest.getEmail());
        if (admin != null && admin.getLoginAccount() != null) {
            LoginAccount account = admin.getLoginAccount();
            if (isPasswordValid(loginRequest.getPassword(), account.getPassword())) {
                String token = jwtUtil.generateToken(account.getAccountId(), account.getRole());
                return new LoginResponseDto(token, account.getRole(), account.getAccountId());
            }
        }

        throw new RuntimeException("Invalid credentials");
    }


    private boolean isPasswordValid(String raw, String hashed) {
        return hashed != null && passwordEncoder.matches(raw, hashed);
    }
}
