package com.SBS_StudentServing_System.dto.account;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordDto {
    private String accountId;
    private String currentPassword;
    private String newPassword;
}