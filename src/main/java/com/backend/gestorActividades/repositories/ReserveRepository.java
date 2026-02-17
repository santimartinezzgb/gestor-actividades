package com.backend.gestorActividades.repositories;

import com.backend.gestorActividades.models.Reserve;
import com.backend.gestorActividades.models.enums.ReserveState;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReserveRepository extends MongoRepository<Reserve, String> {

    // VERIFICA SI EL USUARIO YA TIENE UNA RESERVA PARA LA ACTIVIDAD
    boolean existsByUserIdAndActivityIdAndState(String userId, String activityId, ReserveState state);

    // OBTIENE TODAS LAS RESERVAS DE UN USUARIO
    long countByUserIdAndState(String userId, ReserveState state);
}