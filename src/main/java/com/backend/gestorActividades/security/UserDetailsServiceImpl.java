package com.backend.gestorActividades.security;

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

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Buscar usuario en MongoDB
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        // IMPORTANTE: Spring Security requiere el prefijo ROLE_ para las autoridades
        // Usamos user.getRol().name() para que sea dinámico según tu Enum
        String roleWithPrefix = "ROLE_" + user.getRol().name();

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword()) // Este debe ser el hash de BCrypt almacenado en la DB
                .authorities(Collections.singletonList(new SimpleGrantedAuthority(roleWithPrefix)))
                .accountExpired(false)
                .credentialsExpired(false)
                .accountLocked(false)
                .build();
    }
}