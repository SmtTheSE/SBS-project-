package com.SBS_StudentServing_System.service.student;

import com.SBS_StudentServing_System.dto.student.StudentCreateDto;
import com.SBS_StudentServing_System.dto.student.StudentDto;
import com.SBS_StudentServing_System.dto.account.LoginAccountDto;
import com.SBS_StudentServing_System.model.student.Student;
import com.SBS_StudentServing_System.model.account.LoginAccount;
import com.SBS_StudentServing_System.model.student.related.City;
import com.SBS_StudentServing_System.model.student.related.Ward;
import com.SBS_StudentServing_System.repository.student.StudentRepository;
import com.SBS_StudentServing_System.repository.account.LoginAccountRepository;
import com.SBS_StudentServing_System.repository.student.CityRepository;
import com.SBS_StudentServing_System.repository.student.WardRepository;
import com.SBS_StudentServing_System.repository.academic.StudentEnrollmentRepository;
import com.SBS_StudentServing_System.repository.academic.AttendanceSummaryRepository;
import com.SBS_StudentServing_System.repository.academic.CourseResultRepository;
import com.SBS_StudentServing_System.repository.academic.DailyAttendanceRepository;
import com.SBS_StudentServing_System.repository.academic.StudentAcademicBackgroundRepository;
import com.SBS_StudentServing_System.repository.academic.StudentEnglishPlacementTestRepository;
import com.SBS_StudentServing_System.repository.academic.StudentProgressSummaryRepository;
import com.SBS_StudentServing_System.repository.academic.Transcript_Issue_Repository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final LoginAccountRepository accountRepository;
    private final CityRepository cityRepository;
    private final WardRepository wardRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    
// Academic repositoriesfor deleting related data
    private final StudentEnrollmentRepository studentEnrollmentRepository;
    private final AttendanceSummaryRepository attendanceSummaryRepository;
    private final CourseResultRepository courseResultRepository;
    private final DailyAttendanceRepository dailyAttendanceRepository;
    private final StudentAcademicBackgroundRepository studentAcademicBackgroundRepository;
private final StudentEnglishPlacementTestRepository studentEnglishPlacementTestRepository;
    private final StudentProgressSummaryRepository studentProgressSummaryRepository;
    private final Transcript_Issue_Repository transcriptIssueRequestRepository;

    public StudentService(StudentRepository studentRepository, LoginAccountRepository accountRepository, 
                         CityRepository cityRepository, WardRepository wardRepository, 
                         BCryptPasswordEncoder passwordEncoder,
                         StudentEnrollmentRepository studentEnrollmentRepository,
                         AttendanceSummaryRepository attendanceSummaryRepository,
                         CourseResultRepository courseResultRepository,
                         DailyAttendanceRepository dailyAttendanceRepository,
                         StudentAcademicBackgroundRepository studentAcademicBackgroundRepository,
                         StudentEnglishPlacementTestRepository studentEnglishPlacementTestRepository,
                        StudentProgressSummaryRepository studentProgressSummaryRepository,
                         Transcript_Issue_Repository transcriptIssueRequestRepository) {
        this.studentRepository = studentRepository;
        this.accountRepository = accountRepository;
        this.cityRepository = cityRepository;
        this.wardRepository = wardRepository;
        this.passwordEncoder = passwordEncoder;
        this.studentEnrollmentRepository = studentEnrollmentRepository;
        this.attendanceSummaryRepository = attendanceSummaryRepository;
        this.courseResultRepository = courseResultRepository;
        this.dailyAttendanceRepository = dailyAttendanceRepository;
        this.studentAcademicBackgroundRepository = studentAcademicBackgroundRepository;
        this.studentEnglishPlacementTestRepository = studentEnglishPlacementTestRepository;
        this.studentProgressSummaryRepository = studentProgressSummaryRepository;
        this.transcriptIssueRequestRepository = transcriptIssueRequestRepository;
    }

   public List<StudentDto> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

   public StudentDto getStudent(String studentId) {
        Optional<Student> studentOpt= studentRepository.findById(studentId);
        return studentOpt.map(this::toDto).orElse(null);
    }

    @Transactional
    public StudentDto createStudent(StudentCreateDto dto) {
        // Create or get city
        City city =null;
if (dto.getCityId() != null && !dto.getCityId().isEmpty()) {
            Optional<City> cityOpt = cityRepository.findById(dto.getCityId());
            if (cityOpt.isPresent()) {
                city = cityOpt.get();
            } else if (dto.getCityName() != null&& !dto.getCityName().isEmpty()) {
                // Create new city
city = new City();
                city.setCityId(dto.getCityId());
city.setCityName(dto.getCityName());
                city = cityRepository.save(city);
            }
        }

        // Create or get ward
        Ward ward = null;
if (dto.getWardId() != null && !dto.getWardId().isEmpty()) {
            Optional<Ward> wardOpt =wardRepository.findById(dto.getWardId());
            if (wardOpt.isPresent()) {
                ward = wardOpt.get();
            } else if (dto.getWardName()!= null && !dto.getWardName().isEmpty()) {
               // Create new ward
                ward = new Ward();
                ward.setWardId(dto.getWardId());
                ward.setWardName(dto.getWardName());
                ward = wardRepository.save(ward);
            }
        }

        // Create login account first
        LoginAccount account = new LoginAccount();
       account.setAccountId(dto.getAccountId());
        account.setRole(dto.getAccountRole());
       account.setAccountStatus(dto.getAccountStatus());
        account.setCreatedAt(LocalDateTime.now());
        account.setUpdatedAt(LocalDateTime.now());
        
        // Hash the password if provided, otherwise use a default password
        String rawPassword = (dto.getPassword() != null && !dto.getPassword().isEmpty()) 
            ? dto.getPassword() 
           : "defaultPassword";
        account.setPassword(passwordEncoder.encode(rawPassword));
        
        LoginAccount savedAccount = accountRepository.save(account);

        // Create student
        Student student =new Student();
student.setStudentId(dto.getStudentId());
       student.setLoginAccount(savedAccount);
        student.setFirstName(dto.getFirstName());
       student.setLastName(dto.getLastName());
        student.setDateOfBirth(dto.getDateOfBirth());
        student.setPhone(dto.getPhone());
        student.setStudentEmail(dto.getStudentEmail());
        student.setHomeAddress(dto.getHomeAddress());
      student.setStreetAddress(dto.getStreetAddress());
        student.setBuildingName(dto.getBuildingName());
        student.setGender(dto.getGender());
        student.setNationality(dto.getNationality());
        student.setNationalId(dto.getNationalId());
        student.setStudyPlanId(dto.getStudyPlanId());
student.setCity(city);
      student.setWard(ward);

        Student savedStudent = studentRepository.save(student);
        return toDto(savedStudent);
    }

    @Transactional
    public StudentDto updateStudent(String studentId, StudentCreateDto dto) {
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (studentOpt.isEmpty()) {
            return null;
        }

        Student student = studentOpt.get();

        // Update cityif needed
        if (dto.getCityId() != null && !dto.getCityId().isEmpty()) {
            Optional<City> cityOpt = cityRepository.findById(dto.getCityId());
            City city;
            if(cityOpt.isPresent()) {
                city = cityOpt.get();
            } else if (dto.getCityName() != null && !dto.getCityName().isEmpty()) {
                // Create new city
               city = new City();
                city.setCityId(dto.getCityId());
                city.setCityName(dto.getCityName());
                city= cityRepository.save(city);
            }else {
                city = null;
            }
            student.setCity(city);
        }

        // Update ward if needed
        if (dto.getWardId() != null && !dto.getWardId().isEmpty()) {
            Optional<Ward> wardOpt=wardRepository.findById(dto.getWardId());
            Ward ward;
            if (wardOpt.isPresent()) {
                ward = wardOpt.get();
            } else if (dto.getWardName() != null&& !dto.getWardName().isEmpty()) {
               // Create new ward
                ward = new Ward();
               ward.setWardId(dto.getWardId());
ward.setWardName(dto.getWardName());
                ward = wardRepository.save(ward);
            }else {
                ward = null;
            }
            student.setWard(ward);
        }

       // Update student information
        student.setFirstName(dto.getFirstName());
        student.setLastName(dto.getLastName());
        student.setDateOfBirth(dto.getDateOfBirth());
        student.setPhone(dto.getPhone());
        student.setStudentEmail(dto.getStudentEmail());
        student.setHomeAddress(dto.getHomeAddress());
        student.setStreetAddress(dto.getStreetAddress());
        student.setBuildingName(dto.getBuildingName());
        student.setGender(dto.getGender());
        student.setNationality(dto.getNationality());
        student.setNationalId(dto.getNationalId());
        student.setStudyPlanId(dto.getStudyPlanId());

// Update account information
        LoginAccount account = student.getLoginAccount();
        if (account != null) {
            account.setAccountStatus(dto.getAccountStatus());
            account.setUpdatedAt(LocalDateTime.now());
            
            // Update password if provided
            if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
               account.setPassword(passwordEncoder.encode(dto.getPassword()));
            }
            
            accountRepository.save(account);
        }

        Student updatedStudent = studentRepository.save(student);
        return toDto(updatedStudent);
    }

    @Transactional
    public boolean deleteStudent(String studentId) {
        Optional<Student> studentOpt = studentRepository.findById(studentId);
       if (studentOpt.isEmpty()) {
            return false;
        }

        // Delete all related academic records first
        // Note: We're not deleting City and Ward entities as they can be shared among students
        deleteRelatedAcademicData(studentId);

        Student student = studentOpt.get();
        LoginAccount account = student.getLoginAccount();

        // Delete student first
       studentRepository.delete(student);

        // Then delete the account
        if (account != null) {
            accountRepository.delete(account);
        }

        return true;
    }

    @Transactional
    private void deleteRelatedAcademicData(String studentId) {
        // Delete student enrollments
        studentEnrollmentRepository.deleteAll(
            studentEnrollmentRepository.findByStudentStudentId(studentId)
        );
        
        // Delete attendance summaries
        attendanceSummaryRepository.deleteAll(
            attendanceSummaryRepository.findByStudentStudentId(studentId)
        );
        
        // Delete course results
        courseResultRepository.deleteAll(
            courseResultRepository.findByStudentStudentId(studentId)
        );
        
        // Delete daily attendance records
        dailyAttendanceRepository.deleteAll(
            dailyAttendanceRepository.findByStudentStudentId(studentId)
        );
        
        // Delete student academic backgrounds
        studentAcademicBackgroundRepository.deleteAll(
            studentAcademicBackgroundRepository.findByStudentStudentId(studentId)
        );
        
        // Delete English placement tests
        studentEnglishPlacementTestRepository.deleteAll(
            studentEnglishPlacementTestRepository.findByStudentStudentId(studentId)
        );
        
        // Delete student progress summaries
        studentProgressSummaryRepository.deleteAll(
            studentProgressSummaryRepository.findByStudentStudentId(studentId)
        );
        
        // Delete transcript issue requests
        transcriptIssueRequestRepository.deleteAll(
            transcriptIssueRequestRepository.findByStudentStudentId(studentId)
        );
    }

@Transactional
    public StudentDto toggleAccountStatus(String studentId) {
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (studentOpt.isEmpty()) {
            return null;
        }

        Student student = studentOpt.get();
        LoginAccount account = student.getLoginAccount();
        if (account != null) {
account.setAccountStatus(account.getAccountStatus() == 1 ? 0 : 1);
            account.setUpdatedAt(LocalDateTime.now());
            accountRepository.save(account);
        }

        return toDto(student);
    }

    private StudentDto toDto(Student student) {
        StudentDto dto = new StudentDto();
        dto.setStudentId(student.getStudentId());
      dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        dto.setDateOfBirth(student.getDateOfBirth());
        dto.setPhone(student.getPhone());
        dto.setStudentEmail(student.getStudentEmail());
        dto.setHomeAddress(student.getHomeAddress());
        dto.setStreetAddress(student.getStreetAddress());
        dto.setBuildingName(student.getBuildingName());
        dto.setGender(student.getGender());
        dto.setNationality(student.getNationality());
        dto.setNationalId(student.getNationalId());
        dto.setStudyPlanId(student.getStudyPlanId());

        if (student.getCity() != null) {
            dto.setCityId(student.getCity().getCityId());
        }

        if (student.getWard() != null) {
            dto.setWardId(student.getWard().getWardId());
        }

        // Map login account
        LoginAccount account = student.getLoginAccount();
        if (account != null){
LoginAccountDto accountDto = new LoginAccountDto();
            accountDto.setAccountId(account.getAccountId());
            accountDto.setRole(account.getRole());
            accountDto.setAccountStatus(account.getAccountStatus());
            accountDto.setCreatedAt(account.getCreatedAt());
            accountDto.setUpdatedAt(account.getUpdatedAt());
            accountDto.setLastLoginAt(account.getLastLoginAt());
dto.setLoginAccount(accountDto);
        }

        return dto;
    }
}