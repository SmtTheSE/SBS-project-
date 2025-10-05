package com.SBS_StudentServing_System.service.usefulInfo;

import com.SBS_StudentServing_System.dto.usefulInfo.NewsDTO;
import com.SBS_StudentServing_System.model.admin.Admin;
import com.SBS_StudentServing_System.model.usefulinfo.News;
import com.SBS_StudentServing_System.repository.UsefulInfo.NewsRepository;
import com.SBS_StudentServing_System.repository.admin.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NewsService {
    @Autowired
    private NewsRepository newsRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Value("${app.base-url}")
    private String baseUrl;

    private final String UPLOAD_DIR = "uploads/news/";

    public List<News> getAllNews() {
        return newsRepository.findAll();
    }

    public List<News> getActiveNews() {
        return newsRepository.findByActiveTrue();
    }

    public Optional<News> getNewsById(String newsId) {
        return newsRepository.findById(newsId);
    }

    public News createNews(NewsDTO newsDTO) {
        News news = new News();
        mapDtoToEntity(newsDTO, news);
        news.setCreatedAt(LocalDate.now());
        news.setUpdatedAt(LocalDate.now());
        return newsRepository.save(news);
    }

    public News updateNews(String newsId, NewsDTO newsDTO) {
        Optional<News> existingNews = newsRepository.findById(newsId);
        if (existingNews.isPresent()) {
            News news = existingNews.get();
            mapDtoToEntity(newsDTO, news);
            news.setUpdatedAt(LocalDate.now());
            return newsRepository.save(news);
        }
        throw new RuntimeException("News not found with id: " + newsId);
    }

    public void deleteNews(String newsId) {
        // First get the news to retrieve the image URL before deletion
        Optional<News> newsOptional = newsRepository.findById(newsId);
        if (newsOptional.isPresent()) {
            News news = newsOptional.get();
            // Delete the image file if it exists
            deleteImageFile(news.getImageUrl());
            // Delete the news from database
            newsRepository.deleteById(newsId);
        }
    }

    public List<News> getNewsByAdmin(String adminId) {
        return newsRepository.findByAdminId(adminId);
    }

    public List<News> getNewsByType(String newsType) {
        return newsRepository.findByNewsType(newsType);
    }

    public List<News> searchNewsByTitle(String title) {
        return newsRepository.findByTitleContainingIgnoreCase(title);
    }

    // --- Versions that return full URLs ---
    public List<News> getAllNewsWithFullImageUrls() {
        return newsRepository.findAll().stream()
                .map(this::addFullImageUrl)
                .collect(Collectors.toList());
    }

    public List<News> getActiveNewsWithFullImageUrls() {
        return newsRepository.findByActiveTrue().stream()
                .map(this::addFullImageUrl)
                .collect(Collectors.toList());
    }

    public List<News> getNewsByAdminWithFullImageUrls(String adminId) {
        return newsRepository.findByAdminId(adminId).stream()
                .map(this::addFullImageUrl)
                .collect(Collectors.toList());
    }

    public List<News> getNewsByTypeWithFullImageUrls(String type) {
        return newsRepository.findByNewsType(type).stream()
                .map(this::addFullImageUrl)
                .collect(Collectors.toList());
    }

    public List<News> searchNewsByTitleWithFullImageUrls(String title) {
        return newsRepository.findByTitleContainingIgnoreCase(title).stream()
                .map(this::addFullImageUrl)
                .collect(Collectors.toList());
    }

    // --- Helpers ---
    public News addFullImageUrl(News news) {
        String imageUrl = news.getImageUrl();
        if (imageUrl != null && !imageUrl.startsWith("http")) {
            news.setImageUrl(baseUrl + imageUrl);
        } else if (imageUrl == null || imageUrl.isEmpty()) {
            news.setImageUrl("https://via.placeholder.com/300x200?text=No+Image");
        }
        return news;
    }

    private void mapDtoToEntity(NewsDTO newsDTO, News news) {
        news.setNewsId(newsDTO.getNewsId());
        news.setAdminId(newsDTO.getAdminId());
        news.setTitle(newsDTO.getTitle());
        news.setDescription(newsDTO.getDescription());
        news.setImageUrl(newsDTO.getImageUrl());
        news.setNewsType(newsDTO.getNewsType());
        news.setPublishDate(newsDTO.getPublishDate());
        news.setActive(newsDTO.getActive());

        if (newsDTO.getAdminId() != null) {
            Admin admin = adminRepository.findById(newsDTO.getAdminId())
                    .orElseThrow(() -> new RuntimeException("Admin not found with id: " + newsDTO.getAdminId()));
            // In a real implementation, you might want to set the admin relationship here
        }
    }

    private void deleteImageFile(String imageUrl) {
        try {
            if (imageUrl != null && imageUrl.contains("/uploads/news/")) {
                String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
                Path filePath = Paths.get(UPLOAD_DIR + filename);
                Files.deleteIfExists(filePath);
            }
        } catch (Exception e) {
            System.err.println("Could not delete image file: " + e.getMessage());
        }
    }
}