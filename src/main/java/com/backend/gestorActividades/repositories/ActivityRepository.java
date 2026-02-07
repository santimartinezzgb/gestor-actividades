package com.backend.gestorActividades.repositories;

import com.backend.gestorActividades.models.Activity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityRepository extends MongoRepository<Activity, String> {

    // Buscar actividades por capacidad (tu método actual)
    List<Activity> findByCapacity(int capacity);

    // Buscar actividades que aún no han ocurrido (útil para el catálogo)
    List<Activity> findByDateAfterOrderByDateAsc(LocalDateTime date);

    // Buscar actividades por nombre (ignora mayúsculas/minúsculas)
    List<Activity> findByNameContainingIgnoreCase(String name);
}