package com.SBS_StudentServing_System.controller.admin;

import com.SBS_StudentServing_System.dto.account.ChangePasswordDto;
import com.SBS_StudentServing_System.service.account.LoginAccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/accounts")
public class AdminChangePasswordController {

    private final LoginAccountService accountService;

    public AdminChangePasswordController(LoginAccountService accountService) {
        this.accountService = accountService;
    }

    @PutMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(@PathVariable("id") String accountId, 
                                           @RequestBody ChangePasswordDto changePasswordDto) {
        // Verify that the account ID in the path matches the one in the DTO
        if (!accountId.equals(changePasswordDto.getAccountId())) {
            return ResponseEntity.badRequest().body("Account ID mismatch");
        }

        boolean success = accountService.changePassword(changePasswordDto);
        
        if (success) {
            return ResponseEntity.ok().body("Password changed successfully");
        } else {
            return ResponseEntity.badRequest().body("Failed to change password. Please check your current password.");
        }
    }
}