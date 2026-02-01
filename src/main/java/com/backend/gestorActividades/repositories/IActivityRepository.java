package com.backend.gestorActividades.repositories;

import com.backend.gestorActividades.models.Activity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IActivityRepository extends MongoRepository<Activity, Long> {
    int getCapacity();
}
