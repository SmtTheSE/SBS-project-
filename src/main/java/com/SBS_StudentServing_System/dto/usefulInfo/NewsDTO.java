package com.SBS_StudentServing_System.dto.usefulInfo;

import lombok.Data;
import java.time.LocalDate;

@Data
public class NewsDTO {
    private String newsId;
    private String adminId;
    private String title;
    private String description;
    private String imageUrl;
    private String newsType;
    private LocalDate publishDate;
    private Boolean active;
    private LocalDate createdAt;
    private LocalDate updatedAt;
}