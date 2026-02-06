package com.backend.gestorActividades.services.MongoServices;

import com.backend.gestorActividades.models.User;
import com.backend.gestorActividades.repositories.IUserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MongoUserDetailsService implements UserDetailsService {

    private final IUserRepository repository; // USER REPOSITORY TO ACCESS THE DATABASE

    public MongoUserDetailsService(IUserRepository userRepository){
        this.repository = userRepository;
    }

    @Override
    // LOADER METHOD TO USER DETAILS FOR AUTHENTICATION
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Search for the user in the database using the repository
        User user = repository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        // Build and return a UserDetails object with the user's information and authorities
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(), // USERNAME
                user.getPassword(), // PASSWORD
                user.isActive(), // ACCOUNT ENABLED
                true, // ACCOUNT NON-EXPIRED
                true, // CREDENTIALS NON-EXPIRED
                true, // ACCOUNT NON-LOCKED
                List.of(new SimpleGrantedAuthority("USER"))
        );
    }
}