package com.SBS_StudentServing_System.repository.account;

import com.SBS_StudentServing_System.model.account.LoginAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoginAccountRepository extends JpaRepository<LoginAccount, String> {
}