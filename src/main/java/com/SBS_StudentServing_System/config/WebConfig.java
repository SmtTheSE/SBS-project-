package com.SBS_StudentServing_System.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${profile.image.upload.dir:uploads/profile-images/}")
    private String profileImageUploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve profile images
        registry.addResourceHandler("/uploads/profile-images/**")
                .addResourceLocations("file:" + profileImageUploadDir);
        
        // Serve academic background documents
        registry.addResourceHandler("/uploads/academic-backgrounds/**")
                .addResourceLocations("file:uploads/academic-backgrounds/");
    }
}