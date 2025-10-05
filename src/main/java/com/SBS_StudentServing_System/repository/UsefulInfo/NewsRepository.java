package com.SBS_StudentServing_System.repository.UsefulInfo;

import com.SBS_StudentServing_System.model.usefulinfo.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, String> {
    List<News> findByActiveTrue();
    List<News> findByAdminId(String adminId);
    List<News> findByNewsType(String newsType);
    List<News> findByTitleContainingIgnoreCase(String title);
}