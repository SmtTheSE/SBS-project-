package com.SBS_StudentServing_System.model.academic;

import com.SBS_StudentServing_System.model.lecturer.Lecturer;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "dim_department")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Department {

    @Id
    @Column(name = "department_id", length = 15, nullable = false, unique = true)
    private String departmentId;

    @Column(name = "department_name", length = 100, nullable = false)
    private String departmentName;

    @Column(name = "head_of_department", length = 100)
    private String headOfDepartment;

    @Column(name = "email", length = 100)
    private String email;

    @OneToMany(mappedBy = "department")
    @JsonIgnore
    private List<Lecturer> lecturers;

}