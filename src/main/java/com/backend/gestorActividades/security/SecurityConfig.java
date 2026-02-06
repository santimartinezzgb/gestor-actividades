package com.backend.gestorActividades.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean // PASSWORD ENCODER
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // BCrypt to encrypt passwords securely
    }

    @Bean // ALL SECURITY CONFIGURATION
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // HTTP SECURITY CONFIGURATION
        http
                .csrf(AbstractHttpConfigurer::disable); // Unavailable to testing ( ENABLE IN PRODUCTION )
        return http.build();
    }
}
