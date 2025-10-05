package com.SBS_StudentServing_System.dto.account;

import lombok.Data;

@Data
public class ChangePasswordDto {
    private String accountId;
    private String currentPassword;
    private String newPassword;
}