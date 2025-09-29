package com.SBS_StudentServing_System.controller.account;

import com.SBS_StudentServing_System.dto.account.LoginAccountCreateDto;
import com.SBS_StudentServing_System.dto.account.LoginAccountDto;
import com.SBS_StudentServing_System.service.account.LoginAccountService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
public class LoginAccountController {

    private final LoginAccountService accountService;

    public LoginAccountController(LoginAccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/{id}")
    public LoginAccountDto getAccount(@PathVariable("id") String accountId) {
        return accountService.getAccount(accountId);
    }

    @PostMapping
    public LoginAccountDto createAccount(@RequestBody LoginAccountCreateDto dto) {
        return accountService.createAccount(dto);
    }

    @PutMapping("/{id}/login")
    public LoginAccountDto updateLastLogin(@PathVariable("id") String accountId) {
        return accountService.updateLastLogin(accountId);
    }
}
