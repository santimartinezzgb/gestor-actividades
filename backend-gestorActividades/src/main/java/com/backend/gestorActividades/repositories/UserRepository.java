package com.backend.gestorActividades.repositories;

import com.backend.gestorActividades.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.backend.gestorActividades.models.enums.RolUser;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    // ENCUENTRA UN USUARIO POR SU USERNAME
    Optional<User> findByUsername(String username);

    // VERIFICA SI EXISTE UN USUARIO POR SU USERNAME
    boolean existsByUsername(String username);

    // ENCUENTRA USUARIOS POR SU ROL
    List<User> findByRol(RolUser rol);
}
