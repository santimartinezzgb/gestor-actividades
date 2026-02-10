package com.backend.gestorActividades.services;

import com.backend.gestorActividades.models.User;
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

        // BEFORE PROCESSING, VALIDATE USERNAME AND PASSWORD ARE NOT EMPTY
        ValidationUtil.validateStringNotEmpty(user.getUsername(), "Username");
        ValidationUtil.validateStringNotEmpty(user.getPassword(), "Password");
        ValidationUtil.validateMinLength(user.getPassword(),8,"Password");

        if (user.getId() == null) { // NEW USER

            // ENCODE PASSWORD AND SET USER ACTIVE TO TRUE
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setActive(true);

        } else { // EXISTING USER -> UPDATE

            // CHECK IF THE PASSWORD HAS CHANGED
            userRepository.findById(user.getId()).ifPresent(existingUser -> {

                // COMPARE THE RAW PASSWORD WITH THE EXISTING HASH
                boolean isSamePassword = passwordEncoder.matches(user.getPassword(), existingUser.getPassword());

                if (!isSamePassword) { // ENCODE THE NEW PASSWORD
                    user.setPassword(passwordEncoder.encode(user.getPassword()));

                } else {// KEEP THE EXISTING HASH IF THE PASSWORD HASN'T CHANGED
                    user.setPassword(existingUser.getPassword());
                }
            });
        }
        // SAVE THE USER TO THE DATABASE
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