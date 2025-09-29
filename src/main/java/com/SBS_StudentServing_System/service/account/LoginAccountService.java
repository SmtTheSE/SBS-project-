package com.SBS_StudentServing_System.service.account;

import com.SBS_StudentServing_System.dto.account.LoginAccountCreateDto;
import com.SBS_StudentServing_System.dto.account.LoginAccountDto;
import com.SBS_StudentServing_System.model.account.LoginAccount;
import com.SBS_StudentServing_System.model.student.Student;
import com.SBS_StudentServing_System.repository.account.LoginAccountRepository;
import com.SBS_StudentServing_System.repository.student.StudentRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class LoginAccountService {
    private final StudentRepository studentRepository;
    private final LoginAccountRepository accountRepository;

    public LoginAccountService(StudentRepository studentRepository, LoginAccountRepository accountRepository){
        this.studentRepository = studentRepository;
        this.accountRepository = accountRepository;
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
        account.setPassword("defaultPassword"); // In a real application, this should be properly hashed
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
    
    private LoginAccountDto toDto(LoginAccount acc){
        LoginAccountDto dto = new LoginAccountDto();
        dto.setAccountId(acc.getAccountId());
        dto.setRole(acc.getRole());
        dto.setAccountStatus(acc.getAccountStatus());
        dto.setCreatedAt(acc.getCreatedAt());
        dto.setUpdatedAt(acc.getUpdatedAt());
        dto.setLastLoginAt(acc.getLastLoginAt());
        return dto;
    }
}