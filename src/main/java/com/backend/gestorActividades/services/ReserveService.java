package com.backend.gestorActividades.services;

import com.backend.gestorActividades.models.Activity;
import com.backend.gestorActividades.models.Reserve;
import com.backend.gestorActividades.repositories.IActivityRepository;
import com.backend.gestorActividades.repositories.IReserveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

@Service
public class ReserveService {

    @Autowired
    IReserveRepository reserveRepository; // Datos base de una reserva
    @Autowired
    IActivityRepository activityRepository; // Datos base de una actividad

    public Reserve createReserve(Reserve reserve) {
        // 1. Validar que los datos mínimos vienen en la petición
        if (reserve.getActivity() == null || reserve.getUser() == null) {
            throw new IllegalArgumentException("Datos de actividad o usuario faltantes.");
        }

        // 2. Obtener la actividad real de la DB (para asegurar capacidad y fecha real)
        Activity activity = activityRepository.findById(reserve.getActivity().getId())
                .orElseThrow(() -> new IllegalArgumentException("La actividad no existe."));

        // 3. Validaciones de tiempo
        LocalDateTime now = LocalDateTime.now();
        Duration difference = Duration.between(now, activity.getDate());
        if (difference.toMinutes() <= 15) {
            throw new IllegalArgumentException("No se puede reservar con menos de 15 minutos de antelación.");
        }

        // 4. Validar duplicados (Usuario ya tiene esta actividad)
        if (reserveRepository.existsByUserIdAndActivityId(reserve.getUser().getId(), activity.getId())) {
            throw new IllegalArgumentException("El usuario ya tiene una reserva para esta actividad.");
        }

        // 5. Validar capacidad
        long totalReserves = reserveRepository.countByActivityId(activity.getId());
        if (totalReserves >= activity.getCapacity()) {
            throw new IllegalArgumentException("La actividad está llena.");
        }

        // 6. Configuración final antes de guardar
        reserve.setActivity(activity); // Asignamos el objeto completo de la DB
        reserve.setReservedAt(now);

        return reserveRepository.save(reserve);
    }

    public ArrayList<Reserve> getReserves() {
        return (ArrayList<Reserve>) reserveRepository.findAll();
    }
    public Reserve getReserveById(String id) {
        return reserveRepository.findById(id).orElse(null);
    }

    public Reserve updateReserve(String id, Reserve reserve) {
        Optional<Reserve> existingReserve = reserveRepository.findById(id);
        if (existingReserve.isPresent()) {
            Reserve updatedReserve = existingReserve.get();
            updatedReserve.setUser(reserve.getUser());
            updatedReserve.setActivity(reserve.getActivity());
            return reserveRepository.save(updatedReserve);
        } else {
            return null;
        }
    }

    public void deleteReserve(String id) {
        Optional<Reserve> removedReserve = reserveRepository.findById(id);
        removedReserve.ifPresent(reserveRepository::delete);
    }

}