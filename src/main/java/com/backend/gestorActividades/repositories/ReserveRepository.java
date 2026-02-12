package com.backend.gestorActividades.repositories;

import com.backend.gestorActividades.models.Reserve;
import com.backend.gestorActividades.models.enums.ReserveState;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReserveRepository extends MongoRepository<Reserve, String> {

    // Cuenta solo las plazas ocupadas (las confirmadas)
    long countByActivityIdAndState(String activityId, ReserveState state);

    // Verify if the user already has an active spot
    boolean existsByUserIdAndActivityIdAndState(String userId, String activityId, ReserveState state);

    // Useful for user profile
    List<Reserve> findByUserId(String userId);
}