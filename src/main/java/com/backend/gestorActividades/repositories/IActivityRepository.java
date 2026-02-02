package com.backend.gestorActividades.repositories;

import com.backend.gestorActividades.models.Activity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IActivityRepository extends MongoRepository<Activity, Long> {
    List<Activity> findByCapacity(int capacity);
}