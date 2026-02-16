package com.backend.gestorActividades.repositories;

import com.backend.gestorActividades.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.backend.gestorActividades.models.enums.RolUser;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    List<User> findByRol(RolUser rol);
}
