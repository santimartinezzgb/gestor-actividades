package com.backend.gestorActividades.services;

import com.backend.gestorActividades.models.Activity;
import com.backend.gestorActividades.models.Reserve;
import com.backend.gestorActividades.repositories.ActivityRepository;
import com.backend.gestorActividades.repositories.ReserveRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReserveService {

    private final ReserveRepository reserveRepository;
    private final ActivityRepository activityRepository;

    public ReserveService(ReserveRepository reserveRepository, ActivityRepository activityRepository) {
        this.reserveRepository = reserveRepository;
        this.activityRepository = activityRepository;
    }

    public Reserve createReserve(Reserve reserve) {
        validatePresence(reserve);

        Activity activity = activityRepository.findById(reserve.getActivity().getId())
                .orElseThrow(() -> new RuntimeException("Actividad no encontrada con ID: " + reserve.getActivity().getId()));

        checkTimingConstraint(activity);
        checkDuplicateReserve(reserve.getUser().getId(), activity.getId());
        checkCapacity(activity);

        reserve.setActivity(activity);
        reserve.setReservedAt(LocalDateTime.now());

        return reserveRepository.save(reserve);
    }

    // --- Métodos privados de validación para limpiar el flujo principal ---

    private void validatePresence(Reserve reserve) {
        if (reserve.getActivity() == null || reserve.getUser() == null) {
            throw new IllegalArgumentException("El usuario y la actividad son obligatorios.");
        }
    }

    private void checkTimingConstraint(Activity activity) {
        if (Duration.between(LocalDateTime.now(), activity.getDate()).toMinutes() <= 15) {
            throw new IllegalStateException("Las reservas deben hacerse con más de 15 minutos de antelación.");
        }
    }

    private void checkDuplicateReserve(String userId, String activityId) {
        if (reserveRepository.existsByUserIdAndActivityId(userId, activityId)) {
            throw new IllegalStateException("El usuario ya tiene una reserva activa para esta actividad.");
        }
    }

    private void checkCapacity(Activity activity) {
        long currentReserves = reserveRepository.countByActivityId(activity.getId());
        if (currentReserves >= activity.getCapacity()) {
            throw new IllegalStateException("Lo sentimos, la actividad ha alcanzado su cupo máximo.");
        }
    }

    public List<Reserve> getReserves() {
        return reserveRepository.findAll();
    }

    public Reserve getReserveById(String id) {
        return reserveRepository.findById(id).orElse(null);
    }

    public Reserve updateReserve(String id, Reserve reserve) {
        return reserveRepository.findById(id)
                .map(existing -> {
                    existing.setUser(reserve.getUser());
                    existing.setActivity(reserve.getActivity());
                    return reserveRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
    }

    public void deleteReserve(String id) {
        if (!reserveRepository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar: reserva inexistente.");
        }
        reserveRepository.deleteById(id);
    }
}