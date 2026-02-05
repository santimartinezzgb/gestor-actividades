package com.backend.gestorActividades.util;

import com.backend.gestorActividades.models.Activity;
import com.backend.gestorActividades.models.User;
import com.backend.gestorActividades.repositories.IActivityRepository;
import com.backend.gestorActividades.repositories.IUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(IActivityRepository activityRepository, IUserRepository userRepository) {
        return args -> {
            // 1. Limpiamos las colecciones para no duplicar datos en cada reinicio (Opcional)
            userRepository.deleteAll();
            activityRepository.deleteAll();

            // 2. Crear un usuario de prueba si no existe
            if (userRepository.count() == 0) {

                User user = new User();

                user.setUsername("Juan");
                // Encriptar la contraseña aquí
                user.setPassword("1234");
                user.setActive(true);
                user.setCreatedAt(LocalDateTime.now().plusDays(1));

                userRepository.save(user);
                System.out.println("✅ Usuario de prueba creado: " + user.getUsername());
            }

            // 3. Crear una actividad de prueba (mañana a esta hora)
            if (activityRepository.count() == 0) {
                Activity activity = new Activity();
                activity.setName("Clase de Yoga");
                activity.setCapacity(20);
                activity.setDate(LocalDateTime.now().plusDays(1)); // Mañana
                activityRepository.save(activity);
                System.out.println("✅ Actividad de prueba creada: " + activity.getName());
            }
        };
    }
}