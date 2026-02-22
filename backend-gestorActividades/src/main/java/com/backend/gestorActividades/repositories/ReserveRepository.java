package com.backend.gestorActividades.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.backend.gestorActividades.models.Activity;
import com.backend.gestorActividades.models.Reserve;
import com.backend.gestorActividades.models.enums.ReserveState;

@Repository
public interface ReserveRepository extends MongoRepository<Reserve, String> {

    boolean existsByUserIdAndActivityIdAndState(String userId, String activityId, ReserveState state);

    long countByUserIdAndState(String userId, ReserveState state);

    void deleteByActivity(Activity activity);
}