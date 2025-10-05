package com.SBS_StudentServing_System.model.usefulinfo;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "dim_News")
@Builder
public class News {
    @Id
    @Column(name = "news_id", length = 15)
    private String newsId;

    @Column(name = "admin_id", length = 15)
    private String adminId;

    @Column(name = "title")
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "news_type")
    private String newsType;

    @Column(name = "publish_date")
    private LocalDate publishDate;

    @Column(name = "active")
    private Boolean active;

    @Column(name = "created_at")
    private LocalDate createdAt;

    @Column(name = "updated_at")
    private LocalDate updatedAt;
}