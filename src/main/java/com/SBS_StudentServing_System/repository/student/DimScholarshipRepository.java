package com.SBS_StudentServing_System.repository.student;

import com.SBS_StudentServing_System.model.studentinfo.Scholarship;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DimScholarshipRepository extends JpaRepository<Scholarship, String> {
}
