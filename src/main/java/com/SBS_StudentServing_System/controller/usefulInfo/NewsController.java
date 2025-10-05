package com.SBS_StudentServing_System.controller.usefulInfo;

import com.SBS_StudentServing_System.dto.usefulInfo.NewsDTO;
import com.SBS_StudentServing_System.model.usefulinfo.News;
import com.SBS_StudentServing_System.service.usefulInfo.NewsService;
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
@RequestMapping("/api/news")
@CrossOrigin(origins = "http://localhost:5173")
public class NewsController {
    @Autowired
    private NewsService newsService;

    @Value("${app.base-url}")
    private String baseUrl;

    private final String UPLOAD_DIR = "uploads/news/";

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
            response.put("imageUrl", baseUrl + "/uploads/news/" + filename);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Upload failed: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/update-image")
    public ResponseEntity<Map<String, String>> updateNewsImage(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) {
        try {
            ResponseEntity<Map<String, String>> uploadResponse = uploadImage(file);
            if (uploadResponse.getStatusCode() != HttpStatus.OK) {
                return uploadResponse;
            }

            String newImageUrl = uploadResponse.getBody().get("imageUrl");

            Optional<News> existingNews = newsService.getNewsById(id);
            if (existingNews.isPresent()) {
                News news = existingNews.get();
                deleteOldImageFile(news.getImageUrl());
                news.setImageUrl(newImageUrl);
                news.setUpdatedAt(LocalDate.now());
                newsService.updateNews(id, convertToDTO(news));

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
            if (oldImageUrl != null && oldImageUrl.contains("/uploads/news/")) {
                String filename = oldImageUrl.substring(oldImageUrl.lastIndexOf("/") + 1);
                Path oldFilePath = Paths.get(UPLOAD_DIR + filename);
                Files.deleteIfExists(oldFilePath);
            }
        } catch (Exception e) {
            System.err.println("Could not delete old image: " + e.getMessage());
        }
    }

    private NewsDTO convertToDTO(News news) {
        NewsDTO dto = new NewsDTO();
        dto.setNewsId(news.getNewsId());
        dto.setAdminId(news.getAdminId());
        dto.setTitle(news.getTitle());
        dto.setDescription(news.getDescription());
        dto.setImageUrl(news.getImageUrl());
        dto.setNewsType(news.getNewsType());
        dto.setPublishDate(news.getPublishDate());
        dto.setActive(news.getActive());
        dto.setCreatedAt(news.getCreatedAt());
        dto.setUpdatedAt(news.getUpdatedAt());
        return dto;
    }

    @GetMapping
    public ResponseEntity<List<News>> getAllNews() {
        List<News> news = newsService.getActiveNewsWithFullImageUrls();
        return new ResponseEntity<>(news, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<News> getNewsById(@PathVariable("id") String id) {
        Optional<News> news = newsService.getNewsById(id);
        return news.map(value -> new ResponseEntity<>(newsService.addFullImageUrl(value), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<?> createNews(@RequestBody NewsDTO newsDTO) {
        try {
            News news = newsService.createNews(newsDTO);
            return new ResponseEntity<>(newsService.addFullImageUrl(news), HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<News> updateNews(@PathVariable("id") String id, @RequestBody NewsDTO newsDTO) {
        try {
            News updatedNews = newsService.updateNews(id, newsDTO);
            return new ResponseEntity<>(newsService.addFullImageUrl(updatedNews), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteNews(@PathVariable("id") String id) {
        try {
            newsService.deleteNews(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/admin/{adminId}")
    public ResponseEntity<List<News>> getNewsByAdmin(@PathVariable("adminId") String adminId) {
        List<News> news = newsService.getNewsByAdminWithFullImageUrls(adminId);
        return new ResponseEntity<>(news, HttpStatus.OK);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<News>> getNewsByType(@PathVariable("type") String type) {
        List<News> news = newsService.getNewsByTypeWithFullImageUrls(type);
        return new ResponseEntity<>(news, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<News>> searchNewsByTitle(@RequestParam("title") String title) {
        List<News> news = newsService.searchNewsByTitleWithFullImageUrls(title);
        return new ResponseEntity<>(news, HttpStatus.OK);
    }
}