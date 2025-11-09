package com.SBS_StudentServing_System.controller.admin;

import com.SBS_StudentServing_System.dto.account.LoginAccountCreateDto;
import com.SBS_StudentServing_System.dto.account.LoginAccountDto;
import com.SBS_StudentServing_System.model.account.LoginAccount;
import com.SBS_StudentServing_System.repository.account.LoginAccountRepository;
import com.SBS_StudentServing_System.service.account.LoginAccountService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/api/admin/accounts")
public class AdminLoginAccountController {

    private final LoginAccountService accountService;
    private final LoginAccountRepository accountRepository;

    public AdminLoginAccountController(LoginAccountService accountService, LoginAccountRepository accountRepository) {
        this.accountService = accountService;
        this.accountRepository = accountRepository;
    }

    @GetMapping
    public List<LoginAccountDto> getAllAccounts() {
        return StreamSupport.stream(accountRepository.findAll().spliterator(), false)
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public LoginAccountDto getAccount(@PathVariable("id") String accountId) {
        return accountService.getAccount(accountId);
    }

    @PostMapping
    public LoginAccountDto createAccount(@RequestBody LoginAccountCreateDto dto) {
        return accountService.createAccount(dto);
    }

    @PutMapping("/{id}")
    public LoginAccountDto updateAccount(@PathVariable("id") String accountId, @RequestBody LoginAccountCreateDto dto) {
        LoginAccount account = accountRepository.findById(accountId).orElse(null);
        if (account == null) {
            return null;
        }

        // Update account information
        account.setRole(dto.getRole());
        account.setAccountStatus(dto.getAccountStatus());
        
        return accountService.updateAccount(accountId, account);
    }

    @DeleteMapping("/{id}")
    public boolean deleteAccount(@PathVariable("id") String accountId) {
        LoginAccount account = accountRepository.findById(accountId).orElse(null);
        if (account == null) {
            return false;
        }

        accountRepository.delete(account);
        return true;
    }

    @PutMapping("/{id}/toggle-status")
    public LoginAccountDto toggleAccountStatus(@PathVariable("id") String accountId) {
        LoginAccount account = accountRepository.findById(accountId).orElse(null);
        if (account == null) {
            return null;
        }

        // Toggle account status
        account.setAccountStatus(account.getAccountStatus() == 1 ? 0 : 1);
        accountRepository.save(account);
        
        return toDto(account);
    }

    private LoginAccountDto toDto(LoginAccount account) {
        LoginAccountDto dto = new LoginAccountDto();
        dto.setAccountId(account.getAccountId());
        dto.setRole(account.getRole());
        dto.setAccountStatus(account.getAccountStatus());
        dto.setCreatedAt(account.getCreatedAt());
        dto.setUpdatedAt(account.getUpdatedAt());
        dto.setLastLoginAt(account.getLastLoginAt());
        return dto;
    }
}