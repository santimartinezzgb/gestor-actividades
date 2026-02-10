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

    private final UserRepository userRepository; // TO INTERACT WITH THE DATABASE
    private final BCryptPasswordEncoder passwordEncoder; // TO ENCODE PASSWORDS

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // GET ALL USERS
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    // GET USER BY USERNAME
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    // GET USER BY USERNAME
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // SAVE OR UPDATE USER
    public User saveUser(User user) {
        ValidationUtil.validateStringNotEmpty(user.getUsername(), "Username");
        ValidationUtil.validateStringNotEmpty(user.getPassword(), "Password");

        if (user.getId() == null) { // Nuevo usuario
            // Solo encriptamos si no está ya encriptada (BCrypt empieza por $2a$)
            if (!user.getPassword().startsWith("$2a$")) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            }
            user.setActive(true);
            if (user.getRol() == null) user.setRol(RolUser.USER); // Rol por defecto
        } else {
            // Lógica de actualización si fuera necesaria
        }
        return userRepository.save(user);
    }

    // DELETE USER BY ID
    public boolean deleteUser(String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true; // USER DELETED SUCCESSFULLY
        }
        return false; // USER NOT FOUND
    }

    // DEACTIVATE USER BY ID
    public Optional<User> deactivateUser(String id) {
        return userRepository.findById(id) // FIND THE USER BY ID
                .map(user -> { // IF USER EXISTS
                    user.setActive(false); // SET ACTIVE TO FALSE
                    return userRepository.save(user); // SAVE THE UPDATED USER AND RETURN IT
                });
    }
}