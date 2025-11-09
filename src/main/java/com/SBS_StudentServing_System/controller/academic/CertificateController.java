package com.SBS_StudentServing_System.controller.academic;

import com.SBS_StudentServing_System.model.academic.Certificate;
import com.SBS_StudentServing_System.service.academic.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/academic/certificates")
public class CertificateController {

    // 证书文件存储目录
    private static final String CERTIFICATE_UPLOAD_DIR = "uploads/certificates/";

    @Autowired
    private CertificateService certificateService;

    public CertificateController() {

        File directory = new File(CERTIFICATE_UPLOAD_DIR);
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> uploadCertificate(
            @RequestParam("file") MultipartFile file,
            @RequestParam("studentId") String studentId,
            @RequestParam(value = "certificateType", defaultValue = "general") String certificateType,
            @RequestParam(value = "description", required = false) String description,
            Principal principal) {
        
        Map<String, Object> response = new HashMap<>();
        
        // 验证请求参数
        if (file.isEmpty()) {
            response.put("success", false);
            response.put("message", "File is empty");
            return ResponseEntity.badRequest().body(response);
        }
        
        if (studentId == null || studentId.isEmpty()) {
            response.put("success", false);
            response.put("message", "Student ID is required");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            // 生成唯一文件名
            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            
            String uniqueFileName = studentId + "_" + certificateType + "_" + 
                                  UUID.randomUUID().toString() + fileExtension;
            
            // 构建文件路径
            Path filePath = Paths.get(CERTIFICATE_UPLOAD_DIR + uniqueFileName);
            
            // 保存文件
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // 保存证书信息到数据库
            Certificate certificate = certificateService.saveCertificate(
                studentId, uniqueFileName, filePath.toString(), certificateType, description);
            
            // 返回成功响应
            response.put("success", true);
            response.put("message", "Certificate uploaded successfully");
            response.put("fileName", uniqueFileName);
            response.put("filePath", filePath.toString());
            response.put("certificateId", certificate.getId());
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            response.put("success", false);
            response.put("message", "Failed to upload certificate: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Unexpected error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/download/{fileName}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<Resource> downloadCertificate(
            @PathVariable String fileName,
            Principal principal) {
        try {
            Path filePath = Paths.get(CERTIFICATE_UPLOAD_DIR + fileName);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .header(HttpHeaders.CONTENT_DISPOSITION, 
                               "attachment; filename=\"" + fileName + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 新增API端点用于获取证书信息
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<List<Certificate>> getCertificatesByStudentId(@PathVariable String studentId) {
        List<Certificate> certificates = certificateService.getCertificatesByStudentId(studentId);
        return ResponseEntity.ok(certificates);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Certificate>> getAllCertificates() {
        List<Certificate> certificates = certificateService.getAllCertificates();
        return ResponseEntity.ok(certificates);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> deleteCertificate(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            certificateService.deleteCertificate(id);
            response.put("success", true);
            response.put("message", "Certificate deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to delete certificate: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}