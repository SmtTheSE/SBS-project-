package com.SBS_StudentServing_System.controller.admin;

import com.SBS_StudentServing_System.model.admin.Admin;
import com.SBS_StudentServing_System.service.admin.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<Admin> getAdmin(@PathVariable String accountId) {
        return adminService.getAdminByAccountId(accountId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Admin> createAdmin(@RequestBody Admin admin) {
        // Validate account_id, etc. if needed
        Admin created = adminService.createAdmin(admin);
        return ResponseEntity.ok(created);
    }
    
    @GetMapping
    public List<Admin> getAllAdmins() {
        return adminService.getAllAdmins();
    }
}