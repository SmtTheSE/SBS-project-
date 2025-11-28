//src/main/java/com/SBS_StudentServing_System/config/SecurityConfig.java
package com.SBS_StudentServing_System.config;

import com.SBS_StudentServing_System.service.account.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth.requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/api/profile/**").authenticated()
                        .requestMatchers("/api/accounts/*/change-password").authenticated()
                        .requestMatchers("/api/admin/accounts/*/change-password").authenticated()
                        .requestMatchers("/api/announcements/**").permitAll()
                        .requestMatchers("/api/news/**").permitAll()
                        .requestMatchers("/api/admin/students/**").permitAll()
                        .requestMatchers("/api/admin/lecturers/**").permitAll()
                        .requestMatchers("/api/admin/visa-passports/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/scholarships/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/tuition-payments/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/academic/grades/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/academic/class-schedules/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/academic/student-enrollments/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/academic/attendance-summaries/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/academic/daily-attendances/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/academic/course-results/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/academic/student-progress-summaries/**").hasRole("ADMIN")
                        .requestMatchers("/api/academic/grades/**").permitAll()
                        .requestMatchers("/api/visa-passports/student/**").hasRole("STUDENT")
                        .requestMatchers("/api/visa-passports/**").hasRole("ADMIN")
                        .requestMatchers("/uploads/**").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // 允许来自前端的请求
        config.setAllowedOriginPatterns(Arrays.asList("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);
        // 允许携带认证信息
        config.setExposedHeaders(Arrays.asList("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}