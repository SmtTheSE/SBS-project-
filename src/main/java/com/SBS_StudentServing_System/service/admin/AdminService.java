package com.SBS_StudentServing_System.service.admin;

import com.SBS_StudentServing_System.model.admin.Admin;
import com.SBS_StudentServing_System.repository.admin.AdminRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {
    private final AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public Optional<Admin> getAdminByAccountId(String accountId) {
        return Optional.ofNullable(adminRepository.findByLoginAccount_AccountId(accountId));
    }

    public Admin createAdmin(Admin admin) {
        return adminRepository.save(admin);
    }
    
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }
}