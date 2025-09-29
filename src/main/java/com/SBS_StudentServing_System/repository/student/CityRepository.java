package com.SBS_StudentServing_System.repository.student;

import com.SBS_StudentServing_System.model.student.related.City;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CityRepository extends JpaRepository<City, String> {
}