package com.SBS_StudentServing_System.repository.studentinfo;

import com.SBS_StudentServing_System.model.studentinfo.PartnerInstitution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PartnerInstitutionRepository extends JpaRepository<PartnerInstitution, String> {
}