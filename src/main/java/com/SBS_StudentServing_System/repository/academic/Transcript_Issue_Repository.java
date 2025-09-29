package com.SBS_StudentServing_System.repository.academic;

import com.SBS_StudentServing_System.model.academic.TranscriptIssueRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Transcript_Issue_Repository extends JpaRepository<TranscriptIssueRequest , Long> {

}
