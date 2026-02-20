package com.backend.gestorActividades.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.backend.gestorActividades.models.Activity;
import com.backend.gestorActividades.models.Reserve;
import com.backend.gestorActividades.models.enums.ReserveState;

@Repository
public interface ReserveRepository extends MongoRepository<Reserve, String> {

    // VERIFICA SI EL USUARIO YA TIENE UNA RESERVA PARA LA ACTIVIDAD
    boolean existsByUserIdAndActivityIdAndState(String userId, String activityId, ReserveState state);

    // OBTIENE TODAS LAS RESERVAS DE UN USUARIO
    long countByUserIdAndState(String userId, ReserveState state);

    // ELIMINAR RESERVAS VINCULADAS A UNA ACTIVIDAD
    void deleteByActivity(Activity activity);
}