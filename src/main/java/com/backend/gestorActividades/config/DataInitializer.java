// package com.backend.gestorActividades.util;
//
// import com.backend.gestorActividades.models.Activity;
// import com.backend.gestorActividades.models.User;
// import com.backend.gestorActividades.repositories.IActivityRepository;
// import com.backend.gestorActividades.repositories.IUserRepository;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.crypto.password.PasswordEncoder;
//
// import java.time.LocalDateTime;
//
// @Configuration
// public class DataInitializer {
//
//     @Bean
//     CommandLineRunner initDatabase(IActivityRepository activityRepository,
//                                    IUserRepository userRepository,
//                                    PasswordEncoder passwordEncoder) {
//         return args -> {
//
//             // 1. DELETE ALL EXISTING DATA (FOR TESTING PURPOSES)
//             userRepository.deleteAll();
//             activityRepository.deleteAll();
//
//             // 2. CREATE SAMPLE USER IF NONE EXIST
//             if (userRepository.count() == 0) {
//                 User user = new User();
//                 user.setUsername("Juan");
//                 String raw = "123456";
//                 user.setPassword(passwordEncoder.encode(raw));
//                 user.setCreatedAt(LocalDateTime.now().plusDays(1));
//                 user.setActive(true);
//                 userRepository.save(user);
//                 System.out.println("✅ Example user created: " + user.getUsername());
//             }
//
//             // 3. CREATE SAMPLE ACTIVITY IF NONE EXIST
//             if (activityRepository.count() == 0) {
//                 Activity activity = new Activity();
//                 activity.setName("Yoga");
//                 activity.setDescription("Amateur yoga session.");
//                 activity.setDate(LocalDateTime.now().plusDays(1));
//                 activity.setCapacity(20);
//                 activityRepository.save(activity);
//                 System.out.println("✅ Example activity creates: " + activity.getName());
//             }
//         };
//     }
// }
//