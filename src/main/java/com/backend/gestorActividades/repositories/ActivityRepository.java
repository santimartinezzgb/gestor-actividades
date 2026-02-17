package com.backend.gestorActividades.repositories;

import com.backend.gestorActividades.models.Activity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityRepository extends MongoRepository<Activity, String> {}