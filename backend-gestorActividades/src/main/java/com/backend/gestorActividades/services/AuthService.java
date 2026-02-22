package com.backend.gestorActividades.services;

import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import com.backend.gestorActividades.dto.AuthDTO;
import com.backend.gestorActividades.dto.LoginDTO;
import com.backend.gestorActividades.models.User;
import com.backend.gestorActividades.util.JwtUtil;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;

    private final UserService userService;

    private final JwtUtil jwtUtil;

    public AuthService(AuthenticationManager authenticationManager, UserService userService, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    public AuthDTO login(LoginDTO request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

            String role = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .map(r -> r.replace("ROLE_", ""))
                    .findFirst()
                    .orElse("USER");

            User user = userService.getUserByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found after authentication"));

            String token = jwtUtil.generateToken(user.getUsername(), Map.of(
                    "userId", user.getId(),
                    "role", role
            ));

            return new AuthDTO(user.getId(), request.getUsername(), role, "¡WELCOME!", token);

        } catch (BadCredentialsException e) {
            throw new RuntimeException("Incorrect credentials");
        }
    }

    public User register(User user) {
        return userService.saveUser(user);
    }
}