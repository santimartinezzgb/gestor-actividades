package com.backend.gestorActividades.security;

import com.backend.gestorActividades.config.MongoServices.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;

    public SecurityConfig(UserDetailsServiceImpl userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    // BEAN is a method that produces a bean to be managed by the Spring container.

    // PASSWORD ENCODER CONFIG TO USE BCRYPT FOR PASSWORD HASHING
    // This bean will be used by Spring Security to hash passwords
    //when users register and to verify passwords during login.

    // BCrypt is a strong hashing algorithm
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // 1. ALLOW LOGIN AND REGISTRATION ENDPOINTS TO EVERYONE
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/users").permitAll()
                        .requestMatchers(HttpMethod.GET, "/activities/**").permitAll()

                        // 2. ALLOW SEE ACTIVITIES TO EVERYONE
                        .requestMatchers(HttpMethod.GET, "/api/activities/**").permitAll()

                        // 3. ONLY ADMIN CAN MANAGE USERS
                        .requestMatchers("/api/users/**").hasRole("ADMIN")

                        // 4. THE REST OF THE ENDPOINTS REQUIRE AUTHENTICATION
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults()); // USE BASIC AUTHENTICATION FOR SIMPLICITY

        return http.build(); // RETURN THE CONFIGURED SECURITY FILTER CHAIN
    }

    // AuthenticationManager CONFIG TO USE BCRYPT AND USERDETAILS SERVICE
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authBuilder
                .userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder());
        return authBuilder.build();
    }

    // CORS CONFIG TO ALLOW FRONTEND ACCESS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173")); // FRONTEND URL
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")); // METHODS ALLOWED
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type")); // HEADERS ALLOWED
        configuration.setAllowCredentials(true); // ALLOW CREDENTIALS

        // REGISTER CORS CONFIG FOR ALL PATHS.
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // APPLY CORS CONFIG TO ALL PATHS
        return source; // RETURN CORS CONFIG SOURCE
    }
}