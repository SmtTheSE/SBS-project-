package com.SBS_StudentServing_System.repository.lecturer;

import com.SBS_StudentServing_System.model.lecturer.Lecturer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LecturerRepository extends JpaRepository<Lecturer, String> {}