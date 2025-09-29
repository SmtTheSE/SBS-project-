package com.SBS_StudentServing_System.model.academic;

import com.SBS_StudentServing_System.model.student.Student;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyAttendanceId implements Serializable {

    private Student student;
    private ClassSchedule classSchedule;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        DailyAttendanceId that = (DailyAttendanceId) o;

        if (!Objects.equals(student, that.student)) return false;
        return Objects.equals(classSchedule, that.classSchedule);
    }

    @Override
    public int hashCode() {
        int result = student != null ? student.hashCode() : 0;
        result = 31 * result + (classSchedule != null ? classSchedule.hashCode() : 0);
        return result;
    }
}