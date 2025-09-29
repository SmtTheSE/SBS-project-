package com.SBS_StudentServing_System.repository.admin;

import com.SBS_StudentServing_System.model.admin.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {
    Admin findByLoginAccount_AccountId(String accountId);
    Admin findByEmail(String email);
}

