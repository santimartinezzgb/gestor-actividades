package com.backend.gestorActividades.security;

/**
 * PARA QUE SPRING SECURITY PUEDA CARGAR LOS DETALLES DEL USUARIO DESDE LA BASE DE DATOS
 */

import com.backend.gestorActividades.models.User;
import com.backend.gestorActividades.repositories.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository; // ACCESO A LA BASE DE DATOS PARA OBTENER USUARIOS

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    // CARGA EL USUARIO POR SU USERNAME
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // BUSCA EL USUARIO EN LA BASE DE DATOS,
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        // IMPORTANTE: SPRING SECURITY ESPERA QUE LOS ROLES TENGAN EL PREFIJO "ROLE_"
        String role = "ROLE_" + user.getRol().name();

        // DEVUELVE OBJETO USER DE SPRING SECURITY CON LOS DETALLES DEL USUARIO Y SU ROL
        return org.springframework.security.core.userdetails.User

                // DETALLES DEL USUARIO PARA AUTRENTICACIÓN
                .withUsername(user.getUsername())
                .password(user.getPassword()) // HASH DE BCRYPT ALMACENADO EN LA BASE DE DATOS
                .authorities(Collections.singletonList(new SimpleGrantedAuthority(role)))
                .accountExpired(false)
                .credentialsExpired(false)
                .accountLocked(false)
                .build();
    }
}