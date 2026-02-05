package com.backend.gestorActividades.repositories;

import com.backend.gestorActividades.models.Activity;
import com.backend.gestorActividades.models.Reserve;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Repository
public interface IReserveRepository extends MongoRepository<Reserve, String> {
}
