package com.SBS_StudentServing_System.model.admin;

import com.SBS_StudentServing_System.model.account.LoginAccount;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "dim_admin")
@Getter
@Setter
@Builder
public class Admin {
    @Id
    @Column(name = "admin_id", length = 50)
    private String adminId;

    @OneToOne
    @JoinColumn(name = "account_id", referencedColumnName = "account_id", unique = true)
    private LoginAccount loginAccount;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email")
    private String email;

    @Column(name = "gender")
    private Integer gender;

    @Column(name = "nationality", length = 50)
    private String nationality;

    @Column(name = "jobrole", length = 10)
    private String jobrole;

    @Column(name = "department_id")
    private String departmentId;
}
