package com.backend.gestorActividades.repositories;

import com.backend.gestorActividades.models.Reserve;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReserveRepository extends MongoRepository<Reserve, String> {
    long countByActivityId(String activityId);

    // Verify reserves duplicates for the same user and activity
    boolean existsByUserIdAndActivityId(String userId, String activityId);
}