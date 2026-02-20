package com.backend.gestorActividades.services;

import com.backend.gestorActividades.dto.AuthDTO;
import com.backend.gestorActividades.dto.LoginDTO;
import com.backend.gestorActividades.models.User;
import com.backend.gestorActividades.util.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {

    // AUTENTICAR USUARIOS Y UserService PARA GESTIONAR USUARIOS
    private final AuthenticationManager authenticationManager;

    // SERVICIO PARA GESTIONAR USUARIOS
    private final UserService userService;

    // UTILIDAD JWT PARA GENERAR TOKENS
    private final JwtUtil jwtUtil;

    public AuthService(AuthenticationManager authenticationManager, UserService userService, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    // INICIO DE SESIÓN
    public AuthDTO login(LoginDTO request) {
        try {
            // AUTENTICAR USUARIO
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

            // OBTENER ROL DEL USUARIO
            String role = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .map(r -> r.replace("ROLE_", ""))
                    .findFirst()
                    .orElse("USER");

            // OBTENER USUARIO PARA RESPUESTA
            User user = userService.getUserByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found after authentication"));

            // GENERAR TOKEN JWT CON CLAIMS DE USUARIO
            String token = jwtUtil.generateToken(user.getUsername(), Map.of(
                    "userId", user.getId(),
                    "role", role
            ));

            // DEVOLVER RESPUESTA CON ID, USERNAME, ROL, MENSAJE Y TOKEN JWT
            return new AuthDTO(user.getId(), request.getUsername(), role, "¡WELCOME!", token);

        } catch (BadCredentialsException e) {
            throw new RuntimeException("Incorrect credentials");
        }
    }

    // REGISTRO DE USUARIOS
    public User register(User user) {
        // GUARDAR USUARIO EN LA BASE DE DATOS
        return userService.saveUser(user);
    }
}