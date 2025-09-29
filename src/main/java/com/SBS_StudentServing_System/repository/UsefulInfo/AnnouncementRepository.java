package com.SBS_StudentServing_System.repository.UsefulInfo;

import com.SBS_StudentServing_System.model.usefulinfo.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, String> {

    // Active announcements
    List<Announcement> findByActiveTrue();

    // Corrected method to match Admin entity's primary key
    List<Announcement> findByAdmin_AdminId(String adminId);

    @Query("SELECT a FROM Announcement a WHERE a.startDate <= :date AND a.endDate >= :date")
    List<Announcement> findActiveAnnouncementsByDate(@Param("date") LocalDate date);

    List<Announcement> findByAnnouncementType(String announcementType);

    List<Announcement> findByTitleContainingIgnoreCase(String title);

    List<Announcement> findByStartDateBetween(LocalDate startDate, LocalDate endDate);

    List<Announcement> findByEndDateBefore(LocalDate currentDate);
}
