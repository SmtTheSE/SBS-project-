package com.SBS_StudentServing_System.controller;

import com.SBS_StudentServing_System.dto.academic.*;
import com.SBS_StudentServing_System.model.academic.*;
import com.SBS_StudentServing_System.service.academic.AcademicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/academic")
@CrossOrigin(origins = "http://localhost:5173")
public class AcademicController {

    @Autowired
    private AcademicService academicService;

    // --- StudentAcademicBackground ---
    /*
@GetMapping("/student-academic-backgrounds")
    public List<StudentAcademicBackground> getAllStudentAcademicBackgrounds() {
        return academicService.getAllStudentAcademicBackgrounds();
    }
    @GetMapping("/student-academic-backgrounds/{id}")
    public ResponseEntity<StudentAcademicBackground> getStudentAcademicBackground(@PathVariable String id) {
        return academicService.getStudentAcademicBackground(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/student-academic-backgrounds")
    public StudentAcademicBackground saveStudentAcademicBackground(@RequestBody StudentAcademicBackground entity) {
        return academicService.saveStudentAcademicBackground(entity);
    }
    @DeleteMapping("/student-academic-backgrounds/{id}")
    public ResponseEntity<Void> deleteStudentAcademicBackground(@PathVariable String id) {
        academicService.deleteStudentAcademicBackground(id);
        return ResponseEntity.noContent().build();
    }
*/
    
    // ---StudentEnglishPlacementTest ---
    @GetMapping("/student-english-placement-tests")
    public List<StudentEnglishPlacementTest> getAllStudentEnglishPlacementTests() {
        return academicService.getAllStudentEnglishPlacementTests();
    }
    @GetMapping("/student-english-placement-tests/{id}")
    public ResponseEntity<StudentEnglishPlacementTest> getStudentEnglishPlacementTest(@PathVariable String id) {
        return academicService.getStudentEnglishPlacementTest(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/student-english-placement-tests")
    public StudentEnglishPlacementTest saveStudentEnglishPlacementTest(@RequestBody StudentEnglishPlacementTest entity) {
        return academicService.saveStudentEnglishPlacementTest(entity);
    }
    @DeleteMapping("/student-english-placement-tests/{id}")
    public ResponseEntity<Void> deleteStudentEnglishPlacementTest(@PathVariable String id) {
        academicService.deleteStudentEnglishPlacementTest(id);
        return ResponseEntity.noContent().build();
    }

    // --- StudyPlan ---
    @GetMapping("/study-plans")
    public List<StudyPlan> getAllStudyPlans() {
        return academicService.getAllStudyPlans();
    }
    @GetMapping("/study-plans/{id}")
    public ResponseEntity<StudyPlan> getStudyPlan(@PathVariable String id) {
        return academicService.getStudyPlan(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/study-plans")
    public StudyPlan saveStudyPlan(@RequestBody StudyPlan entity) {
        return academicService.saveStudyPlan(entity);
    }
    @DeleteMapping("/study-plans/{id}")
    public ResponseEntity<Void> deleteStudyPlan(@PathVariable String id) {
        academicService.deleteStudyPlan(id);
        return ResponseEntity.noContent().build();
    }

    // --- StudyPlanCourse ---

    @GetMapping("/study-plan-courses/student/{studentId}")
    public List<StudyPlanCourseDto> getStudyPlanCoursesByStudent(@PathVariable String studentId) {
        return academicService.getStudyPlanCoursesByStudent(studentId);
    }

    @GetMapping("/study-plan-courses")
    public List<StudyPlanCourse> getAllStudyPlanCourses() {
        return academicService.getAllStudyPlanCourses();
    }
    @GetMapping("/study-plan-courses/{id}")
    public ResponseEntity<StudyPlanCourse> getStudyPlanCourse(@PathVariable String id) {
        return academicService.getStudyPlanCourse(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/study-plan-courses")
    public StudyPlanCourse saveStudyPlanCourse(@RequestBody StudyPlanCourse entity) {
        return academicService.saveStudyPlanCourse(entity);
    }
    @DeleteMapping("/study-plan-courses/{id}")
    public ResponseEntity<Void> deleteStudyPlanCourse(@PathVariable String id) {
        academicService.deleteStudyPlanCourse(id);
        return ResponseEntity.noContent().build();
    }

    // --- Grade ---
    @GetMapping("/grades")
    public List<Grade> getAllGrades() {
        return academicService.getAllGrades();
    }
    @GetMapping("/grades/{id}")
    public ResponseEntity<Grade> getGrade(@PathVariable String id) {
return academicService.getGrade(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/grades")
    public Grade saveGrade(@RequestBody Grade entity) {
        return academicService.saveGrade(entity);
    }
    @DeleteMapping("/grades/{id}")
     public ResponseEntity<Void> deleteGrade(@PathVariable String id) {
        academicService.deleteGrade(id);
        return ResponseEntity.noContent().build();
    }

    // --- ClassSchedule ---
    @GetMapping("/class-schedules")
    public List<ClassSchedule> getAllClassSchedules() {
        return academicService.getAllClassSchedules();
    }
    @GetMapping("/class-schedules/{id}")
    public ResponseEntity<ClassSchedule> getClassSchedule(@PathVariable String id) {
        return academicService.getClassSchedule(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/class-schedules")
    public ClassSchedule saveClassSchedule(@RequestBody ClassSchedule entity) {
        return academicService.saveClassSchedule(entity);
    }
    @DeleteMapping("/class-schedules/{id}")
     public ResponseEntity<Void> deleteClassSchedule(@PathVariable String id) {
        academicService.deleteClassSchedule(id);
        return ResponseEntity.noContent().build();
    }

   // --- Course ---
    @GetMapping("/courses")
    public List<Course> getAllCourses() {
        return academicService.getAllCourses();
    }
    @GetMapping("/course-results/total-credits/{studentId}")
    public ResponseEntity<Integer> getTotalCredits(@PathVariable String studentId) {
        Integer total = academicService.getTotalCreditsEarnedByStudentId(studentId);
        return ResponseEntity.ok(total != null ? total : 0);
    }

    @GetMapping("/courses/{id}")
    public ResponseEntity<Course> getCourse(@PathVariable String id) {
        return academicService.getCourse(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/courses")
    public Course saveCourse(@RequestBody Course entity) {
        return academicService.saveCourse(entity);
    }
    @DeleteMapping("/courses/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable String id) {
        academicService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/course-results/student/{studentId}")
    public ResponseEntity<List<CourseResultDto>> getCourseResultsByStudentId(@PathVariable String studentId) {
        return ResponseEntity.ok(academicService.getCourseResultsByStudentId(studentId));
    }


    // --- Semester ---
    @GetMapping("/semesters")
    public List<Semester> getAllSemesters() {
        return academicService.getAllSemesters();
    }
    @GetMapping("/semesters/{id}")
    public ResponseEntity<Semester> getSemester(@PathVariable String id) {
        return academicService.getSemester(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/semesters")
    public Semester saveSemester(@RequestBody Semester entity) {
        return academicService.saveSemester(entity);
    }
    @DeleteMapping("/semesters/{id}")
    public ResponseEntity<Void> deleteSemester(@PathVariable String id) {
        academicService.deleteSemester(id);
        return ResponseEntity.noContent().build();
    }

    // --- Department ---
    @GetMapping("/departments")
    public List<Department> getAllDepartments() {
        return academicService.getAllDepartments();
    }
    @GetMapping("/departments/{id}")
    public ResponseEntity<Department> getDepartment(@PathVariable String id) {
        return academicService.getDepartment(id)
               .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/departments")
    public Department saveDepartment(@RequestBody Department entity) {
        return academicService.saveDepartment(entity);
    }
    @DeleteMapping("/departments/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable String id) {
        academicService.deleteDepartment(id);
        return ResponseEntity.noContent().build();
    }

    // --- TranscriptRequest ---
    @GetMapping("/transcript-requests")
    public List<TranscriptRequest> getAllTranscriptRequests() {
        return academicService.getAllTranscriptRequests();
    }
    @GetMapping("/transcript-requests/{id}")
    public ResponseEntity<TranscriptRequest> getTranscriptRequest(@PathVariable String id) {
        return academicService.getTranscriptRequest(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/transcript-requests")
    public TranscriptRequest saveTranscriptRequest(@RequestBody TranscriptRequest entity) {
        return academicService.saveTranscriptRequest(entity);
    }
    @DeleteMapping("/transcript-requests/{id}")
    public ResponseEntity<Void> deleteTranscriptRequest(@PathVariable String id) {
        academicService.deleteTranscriptRequest(id);
        return ResponseEntity.noContent().build();
    }

    // --- StudentEnrollment ---
    @GetMapping("/student-enrollments")
    public List<StudentEnrollment> getAllStudentEnrollments() {
        return academicService.getAllStudentEnrollments();
    }
    @GetMapping("/student-enrollments/{id}")
    public ResponseEntity<StudentEnrollment> getStudentEnrollment(@PathVariable Long id) {
        return academicService.getStudentEnrollment(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/student-enrollments")
    public StudentEnrollment saveStudentEnrollment(@RequestBody StudentEnrollment entity) {
        return academicService.saveStudentEnrollment(entity);
    }
    @DeleteMapping("/student-enrollments/{id}")
    public ResponseEntity<Void> deleteStudentEnrollment(@PathVariable Long id) {
        academicService.deleteStudentEnrollment(id);
        return ResponseEntity.noContent().build();
    }

    // --- AttendanceSummary---
    @GetMapping("/attendance-summaries")
    public List<AttendanceSummary> getAllAttendanceSummaries() {
        return academicService.getAllAttendanceSummaries();
    }
    @GetMapping("/attendance-summaries/{id}")
    public ResponseEntity<AttendanceSummary> getAttendanceSummary(@PathVariable Long id) {
        return academicService.getAttendanceSummary(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/attendance-summaries")
    public AttendanceSummary saveAttendanceSummary(@RequestBody AttendanceSummary entity) {
        return academicService.saveAttendanceSummary(entity);
    }
    @DeleteMapping("/attendance-summaries/{id}")
    public ResponseEntity<Void> deleteAttendanceSummary(@PathVariable Long id) {
        academicService.deleteAttendanceSummary(id);
        return ResponseEntity.noContent().build();
    }

    // --- CourseResult ---
    @GetMapping("/course-results")
    public List<CourseResult> getAllCourseResults() {
        return academicService.getAllCourseResults();
    }
    @GetMapping("/course-results/{id}")
    public ResponseEntity<CourseResult> getCourseResult(@PathVariable Long id) {
        return academicService.getCourseResult(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/course-results")
    public CourseResult saveCourseResult(@RequestBody CourseResult entity) {
        return academicService.saveCourseResult(entity);
    }
    @DeleteMapping("/course-results/{id}")
    public ResponseEntity<Void> deleteCourseResult(@PathVariable Long id) {
        academicService.deleteCourseResult(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/class-timelines/{studentId}")
    public ResponseEntity<List<ClassTimelineDto>> getClassTimelines(@PathVariable String studentId) {
        List<ClassTimelineDto> timeline = academicService.getClassTimelinesByStudentId(studentId);
        return ResponseEntity.ok(timeline);
    }



    // ---StudentProgressSummary ---
    @GetMapping("/student-progress-summaries")
    public List<StudentProgressSummary> getAllStudentProgressSummaries() {
        return academicService.getAllStudentProgressSummaries();
    }
    @GetMapping("/student-progress-summaries/{id}")
    public ResponseEntity<StudentProgressSummary> getStudentProgressSummary(@PathVariable Long id) {
        return academicService.getStudentProgressSummary(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/student-progress-summaries")
    public StudentProgressSummary saveStudentProgressSummary(@RequestBody StudentProgressSummary entity) {
        return academicService.saveStudentProgressSummary(entity);
    }
    @DeleteMapping("/student-progress-summaries/{id}")
    public ResponseEntity<Void> deleteStudentProgressSummary(@PathVariable Long id) {
        academicService.deleteStudentProgressSummary(id);
        return ResponseEntity.noContent().build();
    }

    // --- Transcript_issue_Request ---
    @GetMapping("/transcript-issue-request")
    public List<TranscriptIssueRequest> getAllTranscript_Issue_request() {
        return academicService.getAllTranscript_Issue_request();
    }
    @GetMapping("/transcript-issue-request/{id}")
    public ResponseEntity<TranscriptIssueRequest> getTranscript_Issue_request(@PathVariable Long id) {
        return academicService.getTranscript_Issue_request(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/transcript-issue-request")
    public TranscriptIssueRequest saveTranscript_Issue_request(@RequestBody TranscriptIssueRequest entity) {
        return academicService.saveTranscript_Issue_request(entity);
    }
    @DeleteMapping("/transcript-issue-request/{id}")
    public ResponseEntity<Void> deleteTranscript_Issue_request(@PathVariable Long id) {
        academicService.deleteTranscript_Issue_request(id);
        return ResponseEntity.noContent().build();
    }

    // ---LecturerCourse ---
    @GetMapping("/lecturer-courses")
    public List<LecturerCourse> getAllLecturerCourses() {
        return academicService.getAllLecturerCourses();
    }
    @GetMapping("/lecturer-courses/{id}")
    public ResponseEntity<LecturerCourse> getLecturerCourse(@PathVariable Long id) {
        return academicService.getLecturerCourse(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/lecturer-courses")
    public LecturerCourse saveLecturerCourse(@RequestBody LecturerCourse entity) {
        return academicService.saveLecturerCourse(entity);
    }
    @DeleteMapping("/lecturer-courses/{id}")
    public ResponseEntity<Void> deleteLecturerCourse(@PathVariable Long id) {
        academicService.deleteLecturerCourse(id);
        return ResponseEntity.noContent().build();
    }




    // --- DailyAttendance ---
@GetMapping("/daily-attendance/student/{studentId}")
    public List<DailyAttendanceDto> getDailyAttendanceByStudentId(@PathVariable String studentId) {
        return academicService.getDailyAttendanceByStudentId(studentId);
    }

    @GetMapping("/daily-attendance/summary/student/{studentId}")
    public ResponseEntity<Map<String, Object>> getAttendanceSummaryByStudentId(@PathVariable String studentId) {
        Map<String, Object> summary = academicService.getAttendanceSummaryByStudentId(studentId);
        return ResponseEntity.ok(summary);
    }
}