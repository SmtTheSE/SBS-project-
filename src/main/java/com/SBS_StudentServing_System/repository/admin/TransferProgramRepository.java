package com.SBS_StudentServing_System.repository.admin;

import com.SBS_StudentServing_System.model.admin.TransferProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransferProgramRepository extends JpaRepository<TransferProgram, String> {
}