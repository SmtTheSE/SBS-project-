package com.SBS_StudentServing_System.service.account;

import com.SBS_StudentServing_System.model.account.LoginAccount;
import com.SBS_StudentServing_System.model.student.Student;
import com.SBS_StudentServing_System.model.admin.Admin;
import com.SBS_StudentServing_System.repository.student.StudentRepository;
import com.SBS_StudentServing_System.repository.admin.AdminRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final StudentRepository studentRepository;
    private final AdminRepository adminRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        if (path.startsWith("/api/announcements")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        String token = null;
        String accountId = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            if (jwtUtil.validateToken(token)) {
                accountId = jwtUtil.extractAccountId(token);
                String role = jwtUtil.extractRole(token);
                
                log.info("Token validated for account ID: {} with role: {}", accountId, role);

                if (SecurityContextHolder.getContext().getAuthentication() == null) {
                    // Check if it's a student or admin account
                    Student student = studentRepository.findByLoginAccount_AccountId(accountId).orElse(null);
                    Admin admin = adminRepository.findByLoginAccount_AccountId(accountId);
                    
                    log.info("Found student: {}, admin: {}", student != null, admin != null);
                    
                    List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                    
                    if (student != null) {
                        authorities.add(new SimpleGrantedAuthority("ROLE_STUDENT"));
                        log.info("Setting ROLE_STUDENT for account: {}", accountId);
                    } else if (admin != null) {
                        authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                        log.info("Setting ROLE_ADMIN for account: {}", accountId);
                    }

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    accountId,
                                    null,
                                    authorities
                            );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}