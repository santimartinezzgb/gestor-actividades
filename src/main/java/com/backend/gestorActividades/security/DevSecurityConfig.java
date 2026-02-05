package com.backend.gestorActividades.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@Profile("dev")
public class DevSecurityConfig {

    @Bean // Configuración de seguridad para el perfil "dev"
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception { // Configura la seguridad HTTP
        http
                .csrf(AbstractHttpConfigurer::disable) // Desactiva la protección CSRF para facilitar el desarrollo (no
                                                       // recomendado para producción)
                // CSRF. "Cross-Site Request Forgery" (Falsificación de Solicitud entre Sitios)
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll()); // Permite todas las solicitudes sin
                                                                               // autenticación
        return http.build(); // Construye y devuelve la cadena de filtros de seguridad
    }

}
