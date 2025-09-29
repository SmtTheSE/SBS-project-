package com.SBS_StudentServing_System.dto.account;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginAccountCreateDto {
    private String accountId;
    private String role;
    private Integer accountStatus;
}
