package com.backend.gestorActividades.config.MongoServices; // Mejor ubicación

import com.backend.gestorActividades.models.User;
import com.backend.gestorActividades.repositories.UserRepository;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Primary
@Service("mongoUserDetailsService") // Nombre de bean explícito para evitar conflicto con security.UserDetailsServiceImpl
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        // Mapeamos el rol del usuario de tu modelo a SimpleGrantedAuthority
        // Si tu modelo User tiene un campo 'role', úsalo aquí.
        // Si no, dejamos "ROLE_USER" por defecto.
        String role = user.getRol() != null ? user.getRol().name() : "USER";

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .disabled(!user.isActive()) // Si isActive es false, la cuenta está deshabilitada
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role)))
                .build();
    }
}