package com.SBS_StudentServing_System.service.usefulInfo;

import com.SBS_StudentServing_System.dto.usefulInfo.AnnouncementDTO;
import com.SBS_StudentServing_System.model.admin.Admin;
import com.SBS_StudentServing_System.model.usefulinfo.Announcement;
import com.SBS_StudentServing_System.repository.UsefulInfo.AnnouncementRepository;
import com.SBS_StudentServing_System.repository.admin.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AnnouncementService {
    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Value("${app.base-url}")
    private String baseUrl;

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }

    public Optional<Announcement> getAnnouncementById(String announcementId) {
        return announcementRepository.findById(announcementId);
    }

    public Announcement createAnnouncement(AnnouncementDTO announcementDTO) {
        Announcement announcement = new Announcement();
        mapDtoToEntity(announcementDTO, announcement);
        announcement.setCreatedAt(LocalDate.now());
        announcement.setUpdatedAt(LocalDate.now());
        return announcementRepository.save(announcement);
    }

    public Announcement updateAnnouncement(String announcementId, AnnouncementDTO announcementDTO) {
        Optional<Announcement> existingAnnouncement = announcementRepository.findById(announcementId);
        if (existingAnnouncement.isPresent()) {
            Announcement announcement = existingAnnouncement.get();
            mapDtoToEntity(announcementDTO, announcement);
            announcement.setUpdatedAt(LocalDate.now());
            return announcementRepository.save(announcement);
        }
        throw new RuntimeException("Announcement Not Found with id " + announcementId);
    }

    public void deleteAnnouncement(String announcementId) {
        announcementRepository.deleteById(announcementId);
    }

    // --- Core queries without URLs ---
    public List<Announcement> getActiveAnnouncements() {
        return announcementRepository.findByActiveTrue();
    }

    public List<Announcement> getAnnouncementsByAdmin(String adminId) {
        return announcementRepository.findByAdmin_AdminId(adminId);
    }

    public List<Announcement> getAnnouncementByType(String announcementType) {
        return announcementRepository.findByAnnouncementType(announcementType);
    }

    public List<Announcement> searchAnnouncementsByTitle(String title) {
        return announcementRepository.findByTitleContainingIgnoreCase(title);
    }

    // --- Versions that return full URLs ---
    public List<Announcement> getAllAnnouncementsWithFullImageUrls() {
        return announcementRepository.findAll().stream()
                .map(a -> addFullImageUrl(a, baseUrl))
                .collect(Collectors.toList());
    }

    public List<Announcement> getActiveAnnouncementsWithFullImageUrls() {
        return announcementRepository.findByActiveTrue().stream()
                .map(a -> addFullImageUrl(a, baseUrl))
                .collect(Collectors.toList());
    }

    public List<Announcement> getAnnouncementsByAdminWithFullImageUrls(String adminId) {
        return announcementRepository.findByAdmin_AdminId(adminId).stream()
                .map(a -> addFullImageUrl(a, baseUrl))
                .collect(Collectors.toList());
    }

    public List<Announcement> getAnnouncementByTypeWithFullImageUrls(String type) {
        return announcementRepository.findByAnnouncementType(type).stream()
                .map(a -> addFullImageUrl(a, baseUrl))
                .collect(Collectors.toList());
    }

    public List<Announcement> searchAnnouncementsByTitleWithFullImageUrls(String title) {
        return announcementRepository.findByTitleContainingIgnoreCase(title).stream()
                .map(a -> addFullImageUrl(a, baseUrl))
                .collect(Collectors.toList());
    }

    // --- Helpers ---
    public Announcement addFullImageUrl(Announcement announcement, String baseUrl) {
        String imageUrl = announcement.getImageUrl();
        if (imageUrl != null && !imageUrl.startsWith("http")) {
            announcement.setImageUrl(baseUrl + imageUrl);
        } else if (imageUrl == null || imageUrl.isEmpty()) {
            announcement.setImageUrl("https://via.placeholder.com/300x200?text=No+Image");
        }
        return announcement;
    }

    public void updateAnnouncementImage(String announcementId, String newImageUrl) {
        Optional<Announcement> optionalAnnouncement = announcementRepository.findById(announcementId);
        if (optionalAnnouncement.isPresent()) {
            Announcement announcement = optionalAnnouncement.get();
            announcement.setImageUrl(newImageUrl);
            announcement.setUpdatedAt(LocalDate.now());
            announcementRepository.save(announcement);
        } else {
            throw new RuntimeException("Announcement not found with id: " + announcementId);
        }
    }

    private void mapDtoToEntity(AnnouncementDTO announcementDTO, Announcement announcement) {
        announcement.setAnnouncementId(announcementDTO.getAnnouncementId());
        announcement.setStartDate(announcementDTO.getStartDate());
        announcement.setEndDate(announcementDTO.getEndDate());
        announcement.setAnnouncementType(announcementDTO.getAnnouncementType());
        announcement.setTitle(announcementDTO.getTitle());
        announcement.setImageUrl(announcementDTO.getImageUrl());
        announcement.setActive(announcementDTO.getActive());

        if (announcementDTO.getAdminId() != null) {
            Admin admin = adminRepository.findById(announcementDTO.getAdminId())
                    .orElseThrow(() -> new RuntimeException("Admin not found with id: " + announcementDTO.getAdminId()));
            announcement.setAdmin(admin);
        }
    }

    public Announcement saveAnnouncement(Announcement announcement) {
        return announcementRepository.save(announcement);
    }
}




