package com.backend.gestorActividades.services;

import com.backend.gestorActividades.models.User;
import com.backend.gestorActividades.models.enums.RolUser;
import com.backend.gestorActividades.repositories.UserRepository;
import com.backend.gestorActividades.util.ValidationUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository; // PARA INTERACTUAR CON LA BASE DE DATOS
    private final BCryptPasswordEncoder passwordEncoder; // PARA ENCRIPTAR CONTRASEÑAS

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // OBTENER TODOS LOS USUARIOS
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    // OBTENER USUARIOS POR ROL
    public List<User> getUsersByRole(RolUser rol) {
        return userRepository.findByRol(rol);
    }

    // OBTENER USUARIO POR ID
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    // OBTENER USUARIO POR NOMBRE DE USUARIO
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // GUARDAR O ACTUALIZAR USUARIO
    public User saveUser(User user) {
        ValidationUtil.validateStringNotEmpty(user.getUsername(), "Username");
        ValidationUtil.validateStringNotEmpty(user.getPassword(), "Password");

        if (user.getId() == null) { // Nuevo usuario
            if (userRepository.existsByUsername(user.getUsername())) {
                throw new com.backend.gestorActividades.exception.DuplicateUserException("Username already exists");
            }
            // Solo encriptar si no está ya encriptado (BCrypt empieza con $2a$)
            if (!user.getPassword().startsWith("$2a$")) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            }
            user.setActive(true);
            if (user.getRol() == null)
                user.setRol(RolUser.USER); // Rol por defecto
        } else {
            // Lógica de actualización si es necesario
        }
        return userRepository.save(user);
    }

    // ELIMINAR USUARIO POR ID
    public boolean deleteUser(String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true; // USUARIO ELIMINADO CORRECTAMENTE
        }
        return false; // USUARIO NO ENCONTRADO
    }

    // DESACTIVAR USUARIO POR ID
    public Optional<User> deactivateUser(String id) {
        return userRepository.findById(id) // BUSCAR AL USUARIO POR ID
                .map(user -> { // SI EL USUARIO EXISTE
                    user.setActive(false); // ESTABLECER ACTIVO A FALSO
                    return userRepository.save(user); // GUARDAR EL USUARIO ACTUALIZADO Y DEVOLVERLO
                });
    }

    // ACTUALIZAR CONTRASEÑA
    public void updatePassword(String userId, String oldPassword, String newPassword) {
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("New password can't be empty");
        }
        if (newPassword.length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters long");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}