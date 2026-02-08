package com.backend.gestorActividades.security;

import com.backend.gestorActividades.models.User;
import com.backend.gestorActividades.models.enums.RolUser;
import com.backend.gestorActividades.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * LOAD USER DETAILS FOR AUTHENTICATION FROM DATABASE
 */

@Service
@Primary
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    // CALLED BY SPRING SECURITY TO LOAD USER DETAILS DURING AUTHENTICATION
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // 1. SEARCH FOR THE USER IN THE DATABASE
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        // 2. SIMPLIFY THE ROLE TO A SINGLE ROLE (ADMIN OR USER) FOR SPRING SECURITY
        String roleName = (user.getRol() == RolUser.ADMIN) ? "ROLE_ADMIN" : "ROLE_USER";
        List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(roleName));

        // 3. BUILD THE OBJECT USER THAT SPRING SECURITY USES FOR AUTHENTICATION
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(authorities)
                .disabled(!user.isActive())
                .build();
    }
}
