package com.SBS_StudentServing_System.service.academic;

import com.SBS_StudentServing_System.dto.academic.DailyAttendanceDto;
import com.SBS_StudentServing_System.model.academic.ClassSchedule;
import com.SBS_StudentServing_System.model.academic.DailyAttendance;
import com.SBS_StudentServing_System.model.academic.DailyAttendanceId;
import com.SBS_StudentServing_System.model.student.Student;
import com.SBS_StudentServing_System.repository.academic.ClassScheduleRepository;
import com.SBS_StudentServing_System.repository.academic.DailyAttendanceRepository;
import com.SBS_StudentServing_System.repository.student.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DailyAttendanceService {

    @Autowired
    private DailyAttendanceRepository dailyAttendanceRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private ClassScheduleRepository classScheduleRepository;

    public List<DailyAttendanceDto> getAllDailyAttendances() {
        return dailyAttendanceRepository.findAll().stream()
                .map(entity -> {
                    DailyAttendanceDto dto = new DailyAttendanceDto();
                    dto.setStudentId(entity.getStudent() != null ? entity.getStudent().getStudentId() : null);
                    dto.setClassScheduleId(entity.getClassSchedule() != null ? entity.getClassSchedule().getClassScheduleId() : null);
                    dto.setAttendanceDate(entity.getAttendanceDate());
                    dto.setStatus(entity.getStatus());
                    dto.setCheckInTime(entity.getCheckInTime());
                    dto.setCheckOutTime(entity.getCheckOutTime());
                    dto.setNote(entity.getNote());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<DailyAttendanceDto> getDailyAttendanceByStudentId(String studentId) {
        return dailyAttendanceRepository.findByStudentStudentId(studentId).stream()
                .map(entity -> {
                    DailyAttendanceDto dto = new DailyAttendanceDto();
                    dto.setStudentId(entity.getStudent() != null ? entity.getStudent().getStudentId() : null);
                    dto.setClassScheduleId(entity.getClassSchedule() != null ? entity.getClassSchedule().getClassScheduleId() : null);
                    dto.setAttendanceDate(entity.getAttendanceDate());
                    dto.setStatus(entity.getStatus());
                    dto.setCheckInTime(entity.getCheckInTime());
                    dto.setCheckOutTime(entity.getCheckOutTime());
                    dto.setNote(entity.getNote());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public DailyAttendanceDto createDailyAttendance(DailyAttendanceDto dailyAttendanceDto) {
        // 获取关联的学生和课程时间表
        Student student = studentRepository.findById(dailyAttendanceDto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + dailyAttendanceDto.getStudentId()));
        
        ClassSchedule classSchedule = classScheduleRepository.findById(dailyAttendanceDto.getClassScheduleId())
                .orElseThrow(() -> new RuntimeException("ClassSchedule not found with id: " + dailyAttendanceDto.getClassScheduleId()));
        
        DailyAttendance dailyAttendance = DailyAttendance.builder()
                .student(student)
                .classSchedule(classSchedule)
                .attendanceDate(dailyAttendanceDto.getAttendanceDate())
                .status(dailyAttendanceDto.getStatus())
                .checkInTime(dailyAttendanceDto.getCheckInTime())
                .checkOutTime(dailyAttendanceDto.getCheckOutTime())
                .note(dailyAttendanceDto.getNote())
                .build();
        
        DailyAttendance savedDailyAttendance = dailyAttendanceRepository.save(dailyAttendance);
        
        DailyAttendanceDto savedDto = new DailyAttendanceDto();
        savedDto.setStudentId(savedDailyAttendance.getStudent() != null ? savedDailyAttendance.getStudent().getStudentId() : null);
        savedDto.setClassScheduleId(savedDailyAttendance.getClassSchedule() != null ? savedDailyAttendance.getClassSchedule().getClassScheduleId() : null);
        savedDto.setAttendanceDate(savedDailyAttendance.getAttendanceDate());
        savedDto.setStatus(savedDailyAttendance.getStatus());
        savedDto.setCheckInTime(savedDailyAttendance.getCheckInTime());
        savedDto.setCheckOutTime(savedDailyAttendance.getCheckOutTime());
        savedDto.setNote(savedDailyAttendance.getNote());
        
        return savedDto;
    }

    public DailyAttendanceDto updateDailyAttendance(String studentId, String classScheduleId, DailyAttendanceDto dailyAttendanceDto) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        
        ClassSchedule classSchedule = classScheduleRepository.findById(classScheduleId)
                .orElseThrow(() -> new RuntimeException("ClassSchedule not found with id: " + classScheduleId));
        
        DailyAttendanceId id = new DailyAttendanceId(student, classSchedule);
        
        if (dailyAttendanceRepository.existsById(id)) {
            DailyAttendance dailyAttendance = DailyAttendance.builder()
                    .student(student)
                    .classSchedule(classSchedule)
                    .attendanceDate(dailyAttendanceDto.getAttendanceDate())
                    .status(dailyAttendanceDto.getStatus())
                    .checkInTime(dailyAttendanceDto.getCheckInTime())
                    .checkOutTime(dailyAttendanceDto.getCheckOutTime())
                    .note(dailyAttendanceDto.getNote())
                    .build();
            
            DailyAttendance savedDailyAttendance = dailyAttendanceRepository.save(dailyAttendance);
            
            DailyAttendanceDto savedDto = new DailyAttendanceDto();
            savedDto.setStudentId(savedDailyAttendance.getStudent() != null ? savedDailyAttendance.getStudent().getStudentId() : null);
            savedDto.setClassScheduleId(savedDailyAttendance.getClassSchedule() != null ? savedDailyAttendance.getClassSchedule().getClassScheduleId() : null);
            savedDto.setAttendanceDate(savedDailyAttendance.getAttendanceDate());
            savedDto.setStatus(savedDailyAttendance.getStatus());
            savedDto.setCheckInTime(savedDailyAttendance.getCheckInTime());
            savedDto.setCheckOutTime(savedDailyAttendance.getCheckOutTime());
            savedDto.setNote(savedDailyAttendance.getNote());
            
            return savedDto;
        } else {
            throw new RuntimeException("DailyAttendance not found with studentId: " + studentId + " and classScheduleId: " + classScheduleId);
        }
    }

    public void deleteDailyAttendance(String studentId, String classScheduleId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        
        ClassSchedule classSchedule = classScheduleRepository.findById(classScheduleId)
                .orElseThrow(() -> new RuntimeException("ClassSchedule not found with id: " + classScheduleId));
        
        DailyAttendanceId id = new DailyAttendanceId(student, classSchedule);
        dailyAttendanceRepository.deleteById(id);
    }
}