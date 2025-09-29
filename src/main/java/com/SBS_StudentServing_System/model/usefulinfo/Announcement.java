package com.SBS_StudentServing_System.model.usefulinfo;

import com.SBS_StudentServing_System.model.admin.Admin;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "dim_announcement")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Announcement {
    @Id
    @Column(name = "announcement_id" , length = 15)
    private String announcementId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id" , referencedColumnName = "admin_id" , nullable = false)
    private Admin admin;

    @Column(name = "start_date" , nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date" , nullable = false)
    private LocalDate endDate;

    @Column(name = "created_at" , nullable = false)
    private LocalDate createdAt;

    @Column(name = "updated_at" , nullable = false)
    private LocalDate updatedAt;

    @Column(name = "announcement_type" , length = 25 , nullable = false)
    private String announcementType;

    @Column(length = 255 , nullable = false)
    private String title;

    @Column(name = "image_url" , length = 255)
    private String imageUrl;

    @Column(name = "is_active" , nullable = false)
    private Boolean active = true;


}
