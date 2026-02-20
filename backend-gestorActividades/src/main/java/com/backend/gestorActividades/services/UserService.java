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
        // VALIDACIONES BÁSICAS
        ValidationUtil.validateStringNotEmpty(user.getUsername(), "Username");
        ValidationUtil.validateStringNotEmpty(user.getPassword(), "Password");

        if (user.getId() == null) {

            // VALIDACIÓN DE DUPLICADOS
            if (userRepository.existsByUsername(user.getUsername())) {
                throw new com.backend.gestorActividades.exception.DuplicateUserException("Username already exists");
            }

            // SINO ESTÁ ENCRIPTADA, ENCRIPTARLA
            // SE AÑADE 2a$ PARA IDENTIFICAR QUE YA ESTÁ ENCRIPTADA (ESTÁNDAR DE BCRYPT)
            if (!user.getPassword().startsWith("$2a$")) {
                // ENCRIPTAR LA CONTRASEÑA ANTES DE GUARDARLA
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            }
            user.setActive(true);
            if (user.getRol() == null)
                user.setRol(RolUser.USER); // ROL POR DEFECTO
        } else {
            throw new IllegalArgumentException("Updating existing users is not allowed through this method.");
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
        return userRepository.findById(id)
                .map(user -> { // SI EL USUARIO EXISTE
                    user.setActive(false);
                    return userRepository.save(user); // GUARDAR EL USUARIO ACTUALIZADO Y DEVOLVERLO
                });
    }

    // ACTUALIZAR CONTRASEÑA
    public void updatePassword(String userId, String oldPassword, String newPassword) {

        // VALIDACIONES BÁSICAS
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("New password can't be empty");
        }
        if (newPassword.length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters long");
        }

        // OBTENER EL USUARIO POR ID
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // ENCRIPTAR LA NUEVA CONTRASEÑA Y GUARDARLA
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user); // GUARDAR EL USUARIO CON LA NUEVA CONTRASEÑA
    }
}