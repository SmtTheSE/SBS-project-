package com.SBS_StudentServing_System.service.account;

import com.SBS_StudentServing_System.dto.account.LoginAccountCreateDto;
import com.SBS_StudentServing_System.dto.account.LoginAccountDto;
import com.SBS_StudentServing_System.dto.account.ChangePasswordDto;
import com.SBS_StudentServing_System.model.account.LoginAccount;
import com.SBS_StudentServing_System.model.student.Student;
import com.SBS_StudentServing_System.repository.account.LoginAccountRepository;
import com.SBS_StudentServing_System.repository.student.StudentRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class LoginAccountService {
    private final StudentRepository studentRepository;
    private final LoginAccountRepository accountRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public LoginAccountService(StudentRepository studentRepository, 
                              LoginAccountRepository accountRepository,
                              BCryptPasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginAccountDto getAccount(String accountId){
        Optional<Student> studentOpt = studentRepository.findByLoginAccount_AccountId(accountId);
        if(studentOpt.isEmpty()) return null;
        LoginAccount acc = studentOpt.get().getLoginAccount();
        return toDto(acc);
    }

    @Transactional
    public LoginAccountDto createAccount(LoginAccountCreateDto dto) {
        LoginAccount account = new LoginAccount();
        account.setAccountId(dto.getAccountId());
        account.setRole(dto.getRole());
        account.setAccountStatus(dto.getAccountStatus());
        account.setCreatedAt(LocalDateTime.now());
        account.setPassword(passwordEncoder.encode("defaultPassword")); // In a real application, this should be properly hashed
        accountRepository.save(account);
        return toDto(account);
    }

    @Transactional
    public LoginAccountDto updateLastLogin(String accountId) {
        Optional<Student> studentOpt = studentRepository.findByLoginAccount_AccountId(accountId);
        if (studentOpt.isPresent()) {
            LoginAccount acc = studentOpt.get().getLoginAccount();
            acc.setLastLoginAt(LocalDateTime.now());
            acc.setUpdatedAt(LocalDateTime.now());
            accountRepository.save(acc);
            return toDto(acc);
        }
        return null;
    }
    
    @Transactional
    public LoginAccountDto updateAccount(String accountId, LoginAccount updatedAccount) {
        Optional<LoginAccount> accountOpt = accountRepository.findById(accountId);
        if (accountOpt.isPresent()) {
            LoginAccount acc = accountOpt.get();
            acc.setRole(updatedAccount.getRole());
            acc.setAccountStatus(updatedAccount.getAccountStatus());
            acc.setUpdatedAt(LocalDateTime.now());
            accountRepository.save(acc);
            return toDto(acc);
        }
        return null;
    }
    
    @Transactional
    public boolean changePassword(ChangePasswordDto changePasswordDto) {
        Optional<LoginAccount> accountOpt = accountRepository.findById(changePasswordDto.getAccountId());
        if (accountOpt.isPresent()) {
            LoginAccount account = accountOpt.get();
            
            // Check if current password is correct
            if (!passwordEncoder.matches(changePasswordDto.getCurrentPassword(), account.getPassword())) {
                return false;
            }
            
            // Update with new password
            account.setPassword(passwordEncoder.encode(changePasswordDto.getNewPassword()));
            account.setUpdatedAt(LocalDateTime.now());
            accountRepository.save(account);
            return true;
        }
        return false;
    }
    
    // Removed profile image functionality
    // @Transactional
    // public boolean updateProfileImage(String studentId, String imageUrl) {
    //     Optional<Student> studentOpt = studentRepository.findById(studentId);
    //     if (studentOpt.isPresent()) {
    //         LoginAccount account = studentOpt.get().getLoginAccount();
    //         account.setProfileImageUrl(imageUrl);
    //         account.setUpdatedAt(LocalDateTime.now());
    //         accountRepository.save(account);
    //         return true;
    //     }
    //     return false;
    // }
    
    // public String getProfileImage(String studentId) {
    //     Optional<Student> studentOpt = studentRepository.findById(studentId);
    //     if (studentOpt.isPresent()) {
    //         return studentOpt.get().getLoginAccount().getProfileImageUrl();
    //     }
    //     return null;
    // }
    
    private LoginAccountDto toDto(LoginAccount acc){
        LoginAccountDto dto = new LoginAccountDto();
        dto.setAccountId(acc.getAccountId());
        dto.setRole(acc.getRole());
        dto.setAccountStatus(acc.getAccountStatus());
        dto.setCreatedAt(acc.getCreatedAt());
        dto.setUpdatedAt(acc.getUpdatedAt());
        dto.setLastLoginAt(acc.getLastLoginAt());
        // Removed profile image URL
        // dto.setProfileImageUrl(acc.getProfileImageUrl());
        return dto;
    }
}