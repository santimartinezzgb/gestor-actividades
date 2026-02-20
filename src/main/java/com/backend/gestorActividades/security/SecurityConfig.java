package com.backend.gestorActividades.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration // CLASE DE CONFIGURACIÓN DE SPRING
@EnableWebSecurity // HABILITA LA CONFIGURACIÓN DE SEGURIDAD EN LA APLICACIÓN
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(UserDetailsServiceImpl userDetailsService, JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    // CONFIGURACIÓN DE ENCRIPTACIÓN DE CONTRASEÑAS CON BCRYPT
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    // CONFIGURACIÓN DE AUTENTICACIÓN CON DAO ( DAO. Interfaz para acceder a los datos de usuario)
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    // CONFIGURACIÓN DEL GESTOR DE AUTENTICACIÓN PARA USAR EL PROVEEDOR DE AUTENTICACIÓN DEFINIDO
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    // CONFIGURACIÓN DE LA CADENA DE FILTROS DE SEGURIDAD ( DEFINE REGLAS PARA LAS RUTAS DE LA APLICACIÓN )
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // CONFIGURACIÓN DE CORS, CSRF, SESIONES Y AUTORIZACIÓN DE RUTAS
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // 1. AUTENTICACIÓN ( LOGIN ) Y REGISTRO: públicas
                        .requestMatchers("/auth/**").permitAll()

                        // 2. LECTURA de actividades: pública
                        .requestMatchers(HttpMethod.GET, "/activities/**").permitAll()

                        // 3. CUALQUIER OTRA RUTA REQUIERE JWT VÁLIDO
                        .anyRequest().authenticated())

                // REGISTRAR FILTRO JWT ANTES DEL FILTRO DE AUTENTICACIÓN POR DEFECTO
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build(); // CONSTRUYE Y DEVUELVE LA CADENA DE FILTROS DE SEGURIDAD CONFIGURADA
    }

    @Bean
    // CONFIGURACIÓN DE CORS PARA PERMITIR SOLICITUDES DESDE CUALQUIER ORIGEN
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        configuration.setAllowCredentials(false);

        // CONFIGURACIÓN PARA TODAS LAS RUTAS DE LA APLICACIÓN
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}