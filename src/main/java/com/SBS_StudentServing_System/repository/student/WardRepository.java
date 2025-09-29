package com.SBS_StudentServing_System.repository.student;

import com.SBS_StudentServing_System.model.student.related.Ward;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WardRepository extends JpaRepository<Ward, String> {
}