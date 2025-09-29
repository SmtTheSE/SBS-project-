package com.SBS_StudentServing_System.model.account;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "dim_LoginAccount")
@Getter
@Setter
@Builder
public class LoginAccount {
    @Id
    @Column(name = "account_id", length = 15)
    private String accountId;

    @Column(name = "role", length = 15, nullable = false)
    private String role;

    @Column(name = "account_status", nullable = false)
    private Integer accountStatus;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "password", length = 255, nullable = false)
    private String password; // This should be a hash
}
