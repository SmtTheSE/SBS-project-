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
@Table(name = "subdim_ward")
@Getter
@Setter
@Builder
public class Ward {
    @Id
    @Column(name = "ward_id", length = 15)
    private String wardId;

    @Column(name = "ward_name", length = 100)
    private String wardName;
}
