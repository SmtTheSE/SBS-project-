package com.SBS_StudentServing_System.controller.academic;

import com.SBS_StudentServing_System.dto.academic.StudentAcademicBackgroundDto;
import com.SBS_StudentServing_System.service.academic.StudentAcademicBackgroundService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@RestController
@RequestMapping("/api/admin/academic/student-academic-backgrounds-file")
@PreAuthorize("hasRole('ADMIN')")
public class StudentAcademicBackgroundFileController {

    @Autowired
    private StudentAcademicBackgroundService studentAcademicBackgroundService;

    @Value("${app.base-url}")
    private String baseUrl;

    private final String UPLOAD_DIR = "uploads/academic-backgrounds/";

    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentAcademicBackgroundDto> createStudentAcademicBackgroundWithFile(
            @RequestParam("backgroundId") String backgroundId,
            @RequestParam("studentId") String studentId,
            @RequestParam("highestQualification") String highestQualification,
            @RequestParam("institutionName") String institutionName,
            @RequestParam(value = "englishQualification", required = false) String englishQualification,
            @RequestParam(value = "englishScore", required = false) Float englishScore,
            @RequestParam("requiredForPlacementTest") Boolean requiredForPlacementTest,
            @RequestParam(value = "documentFile", required = false) MultipartFile documentFile) {
        
        try {
            String documentUrl = null;
            
            // Handle file upload if provided
            if (documentFile != null && !documentFile.isEmpty()) {
                // Validate file
                if (!isValidPdfFile(documentFile)) {
                    System.out.println("File validation failed for: " + documentFile.getOriginalFilename());
                    return ResponseEntity.badRequest().build();
                }

                // Create upload directory if not exists
                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                // Generate filename
                String originalFilename = documentFile.getOriginalFilename();
                String filename = backgroundId + "_" + System.currentTimeMillis() + 
                    (originalFilename != null && originalFilename.contains(".") ? 
                        originalFilename.substring(originalFilename.lastIndexOf(".")) : ".pdf");

                // Save file
                Path filePath = uploadPath.resolve(filename);
                Files.copy(documentFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                
                // Set document URL
                documentUrl = baseUrl + "/uploads/academic-backgrounds/" + filename;
            }

            // Create DTO
            StudentAcademicBackgroundDto backgroundDto = new StudentAcademicBackgroundDto();
            backgroundDto.setBackgroundId(backgroundId);
            backgroundDto.setStudentId(studentId);
            backgroundDto.setHighestQualification(highestQualification);
            backgroundDto.setInstitutionName(institutionName);
            backgroundDto.setEnglishQualification(englishQualification);
            backgroundDto.setEnglishScore(englishScore);
            backgroundDto.setRequiredForPlacementTest(requiredForPlacementTest);
            backgroundDto.setDocumentUrl(documentUrl);

            // Create background record
            StudentAcademicBackgroundDto createdBackground = studentAcademicBackgroundService.createStudentAcademicBackground(backgroundDto);
            
            if (createdBackground != null) {
                return ResponseEntity.status(201).body(createdBackground);
            } else {
                return ResponseEntity.badRequest().build();
            }
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    private boolean isValidPdfFile(MultipartFile file) {
        // Check file type
        String contentType = file.getContentType();
        System.out.println("File content type: " + contentType);
        if (contentType == null || !contentType.equals("application/pdf")) {
            System.out.println("Invalid content type: " + contentType);
            return false;
        }

        // Check file extension
        String originalFilename = file.getOriginalFilename();
        System.out.println("File name: " + originalFilename);
        if (originalFilename == null || !originalFilename.toLowerCase().endsWith(".pdf")) {
            System.out.println("Invalid file extension: " + originalFilename);
            return false;
        }

        // Check file size (limit to 10MB)
        long fileSize = file.getSize();
        System.out.println("File size: " + fileSize);
        if (fileSize > 10 * 1024 * 1024) {
            System.out.println("File too large: " + fileSize);
            return false;
        }

        return true;
    }
}