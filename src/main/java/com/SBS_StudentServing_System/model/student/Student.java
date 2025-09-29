package com.SBS_StudentServing_System.model.student;
import com.SBS_StudentServing_System.model.account.LoginAccount;
import com.SBS_StudentServing_System.model.student.related.City;
import com.SBS_StudentServing_System.model.student.related.Ward;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "dim_student")
@Getter
@Setter
@Builder
public class Student {
    @Id
    @Column(name = "student_id", length = 50)
    private String studentId;

    @ManyToOne
    @JoinColumn(name = "account_id", unique = true)
    private LoginAccount loginAccount;

    @Column(name = "first_name", length = 100)
    private String firstName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "student_email", length = 100)
    private String studentEmail;

    @Column(name = "home_address", length = 150)
    private String homeAddress;

    @ManyToOne
    @JoinColumn(name = "ward_id", columnDefinition = "varchar(15)", foreignKey = @ForeignKey(name = "FK_Student_Ward", value = ConstraintMode.PROVIDER_DEFAULT))
    private Ward ward;


    @ManyToOne
    @JoinColumn(name = "city_id", nullable = false, columnDefinition = "varchar(15)", foreignKey = @ForeignKey(name = "FK_Student_City", value = ConstraintMode.PROVIDER_DEFAULT))
    private City city;

    @Column(name = "street_address", length = 255)
    private String streetAddress;

    @Column(name = "buildingName", length = 100)
    private String buildingName;

    @Column(name = "gender")
    private Integer gender;

    @Column(name = "nationality", length = 50)
    private String nationality;

    @Column(name = "national_id", length = 50)
    private String nationalId; // Required only if nationality = VN

    @Column(name = "study_plan_id", length = 50)
    private String studyPlanId;

}