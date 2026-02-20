package com.backend.gestorActividades.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.backend.gestorActividades.models.Activity;

@Repository
public interface ActivityRepository extends MongoRepository<Activity, String> {

    // BUSCAR ACTIVIDADES CUYA FECHA SEA ANTERIOR A LA INDICADA
    List<Activity> findByDateBefore(LocalDateTime date);
}