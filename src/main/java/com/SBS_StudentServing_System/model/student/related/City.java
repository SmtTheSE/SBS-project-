package com.SBS_StudentServing_System.model.student.related;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "subdim_city")
@Getter
@Setter
@Builder
public class City {
    @Id
    @Column(name = "city_id", length = 15)
    private String cityId;

    @Column(name = "city_name", length = 100, nullable = false)
    private String cityName;
}
