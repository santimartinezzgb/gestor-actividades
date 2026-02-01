package com.backend.gestorActividades.repositories;

import com.backend.gestorActividades.models.Activity;
import com.backend.gestorActividades.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IUserRepository extends MongoRepository<User, Long> {
}
