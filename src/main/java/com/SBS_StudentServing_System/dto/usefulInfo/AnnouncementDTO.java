package com.SBS_StudentServing_System.dto.usefulInfo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementDTO {
    private String announcementId;
    private String adminId;

    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate createdAt;
    private LocalDate updatedAt;
    private String announcementType;
    private String title;
    private String imageUrl;
    private Boolean active;


}
