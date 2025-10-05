package com.SBS_StudentServing_System.controller.account;

import com.SBS_StudentServing_System.service.account.LoginAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/account")
public class ProfileController {

    @Autowired
    private LoginAccountService accountService;

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${profile.image.upload.dir:uploads/profile-images/}")
    private String UPLOAD_DIR;

    @PostMapping("/profile/upload-image")
    public ResponseEntity<Map<String, String>> uploadProfileImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("studentId") String studentId) {
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No file selected"));
            }

            String contentType = file.getContentType();
            if (!isValidImageType(contentType)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Only JPG, PNG, GIF files allowed"));
            }

            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body(Map.of("error", "File must be less than 5MB"));
            }

            // Create upload directory if not exists
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate filename based on studentId
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
            } else {
                // Default to jpg if no extension
                extension = ".jpg";
            }
            
            // Ensure we have a valid image extension
            if (!extension.equals(".jpg") && !extension.equals(".jpeg") && 
                !extension.equals(".png") && !extension.equals(".gif")) {
                extension = ".jpg"; // Default to jpg
            }

            String filename = studentId + extension;

            // Save file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Create response
            Map<String, String> response = new HashMap<>();
            response.put("filename", filename);
            response.put("imageUrl", baseUrl + "/uploads/profile-images/" + filename);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Upload failed: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Upload failed: " + e.getMessage()));
        }
    }

    @GetMapping("/profile/{studentId}/image")
    public ResponseEntity<Map<String, String>> getProfileImage(
            @PathVariable String studentId) {
        try {
            // Check for different possible image extensions
            String[] extensions = {".jpg", ".jpeg", ".png", ".gif"};
            String imageUrl = null;
            
            for (String ext : extensions) {
                Path imagePath = Paths.get(UPLOAD_DIR, studentId + ext);
                if (Files.exists(imagePath)) {
                    imageUrl = baseUrl + "/uploads/profile-images/" + studentId + ext;
                    break;
                }
            }
            
            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", imageUrl); // Will be null if no image found
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to get profile image: " + e.getMessage()));
        }
    }

    private boolean isValidImageType(String contentType) {
        return contentType != null && (
                contentType.equals("image/jpeg") ||
                        contentType.equals("image/png") ||
                        contentType.equals("image/gif")
        );
    }
}