package com.SBS_StudentServing_System.controller.usefulInfo;

import com.SBS_StudentServing_System.dto.usefulInfo.AnnouncementDTO;
import com.SBS_StudentServing_System.model.usefulinfo.Announcement;
import com.SBS_StudentServing_System.service.usefulInfo.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {
    @Autowired
    private AnnouncementService announcementService;

    @Value("${app.base-url}")
    private String baseUrl;

    private final String UPLOAD_DIR = "uploads/announcements/";


    @PostMapping("/upload-image")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
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

            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = file.getOriginalFilename();
            String filename = System.currentTimeMillis() + "_" + originalFilename.replaceAll("[^a-zA-Z0-9.]", "_");

            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            Map<String, String> response = new HashMap<>();
            response.put("filename", filename);
            response.put("imageUrl", baseUrl + "/uploads/announcements/" + filename);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Upload failed: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/update-image")
    public ResponseEntity<Map<String, String>> updateAnnouncementImage(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) {
        try {
            ResponseEntity<Map<String, String>> uploadResponse = uploadImage(file);
            if (uploadResponse.getStatusCode() != HttpStatus.OK) {
                return uploadResponse;
            }

            String newImageUrl = uploadResponse.getBody().get("imageUrl");

            Optional<Announcement> existingAnnouncement = announcementService.getAnnouncementById(id);
            if (existingAnnouncement.isPresent()) {
                Announcement announcement = existingAnnouncement.get();
                deleteOldImageFile(announcement.getImageUrl());
                announcement.setImageUrl(newImageUrl);
                announcement.setUpdatedAt(LocalDate.now());
                announcementService.saveAnnouncement(announcement);

                return ResponseEntity.ok(Map.of("message", "Image updated successfully", "imageUrl", newImageUrl));
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update image: " + e.getMessage()));
        }
    }

    private boolean isValidImageType(String contentType) {
        return contentType != null && (
                contentType.equals("image/jpeg") ||
                        contentType.equals("image/png") ||
                        contentType.equals("image/gif") ||
                        contentType.equals("image/webp")
        );
    }

    private void deleteOldImageFile(String oldImageUrl) {
        try {
            if (oldImageUrl != null && oldImageUrl.contains("/uploads/announcements/")) {
                String filename = oldImageUrl.substring(oldImageUrl.lastIndexOf("/") + 1);
                Path oldFilePath = Paths.get(UPLOAD_DIR + filename);
                Files.deleteIfExists(oldFilePath);
            }
        } catch (Exception e) {
            System.err.println("Could not delete old image: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Announcement>> getAllAnnouncements() {
        List<Announcement> announcements = announcementService.getAllAnnouncementsWithFullImageUrls();
        return new ResponseEntity<>(announcements, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Announcement> getAnnouncementById(@PathVariable("id") String id) {
        Optional<Announcement> announcement = announcementService.getAnnouncementById(id);
        return announcement.map(value -> new ResponseEntity<>(announcementService.addFullImageUrl(value, baseUrl), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<?> createAnnouncement(@RequestBody AnnouncementDTO announcementDTO) {
        try {
            Announcement announcement = announcementService.createAnnouncement(announcementDTO);
            return new ResponseEntity<>(announcementService.addFullImageUrl(announcement, baseUrl), HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace(); // Log the error to console
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Announcement> updateAnnouncement(@PathVariable("id") String id, @RequestBody AnnouncementDTO announcementDTO) {
        try {
            Announcement updatedAnnouncement = announcementService.updateAnnouncement(id, announcementDTO);
            return new ResponseEntity<>(announcementService.addFullImageUrl(updatedAnnouncement, baseUrl), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteAnnouncement(@PathVariable("id") String id) {
        try {
            announcementService.deleteAnnouncement(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/active")
    public ResponseEntity<List<Announcement>> getActiveAnnouncements() {
        try {
            List<Announcement> announcements = announcementService.getActiveAnnouncementsWithFullImageUrls();
            if (announcements.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(announcements, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/admin/{adminId}")
    public ResponseEntity<List<Announcement>> getAnnouncementsByAdmin(@PathVariable("adminId") String adminId) {
        List<Announcement> announcements = announcementService.getAnnouncementsByAdminWithFullImageUrls(adminId);
        return new ResponseEntity<>(announcements, HttpStatus.OK);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Announcement>> getAnnouncementsByType(@PathVariable("type") String type) {
        List<Announcement> announcements = announcementService.getAnnouncementByTypeWithFullImageUrls(type);
        return new ResponseEntity<>(announcements, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Announcement>> searchAnnouncementsByTitle(@RequestParam("title") String title) {
        List<Announcement> announcements = announcementService.searchAnnouncementsByTitleWithFullImageUrls(title);
        return new ResponseEntity<>(announcements, HttpStatus.OK);
    }
}
