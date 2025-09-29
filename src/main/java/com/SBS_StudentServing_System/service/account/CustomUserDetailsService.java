package com.SBS_StudentServing_System.service.account;

import com.SBS_StudentServing_System.model.account.LoginAccount;
import com.SBS_StudentServing_System.model.student.Student;
import com.SBS_StudentServing_System.repository.student.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final StudentRepository studentRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Student student = studentRepository.findByStudentEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Student not found with email: " + email));
        LoginAccount account = student.getLoginAccount();
        if (account == null) {
            throw new UsernameNotFoundException("Login account not found for student: " + email);
        }
        // For demonstration, password is not handled here
        return User.builder()
                .username(account.getAccountId())
                .password("") // Password should be handled securely and encoded
                .roles(account.getRole() != null ? account.getRole() : "USER")
                .build();
    }
}