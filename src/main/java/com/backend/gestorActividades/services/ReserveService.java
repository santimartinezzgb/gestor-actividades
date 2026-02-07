package com.backend.gestorActividades.services;

import com.backend.gestorActividades.models.Activity;
import com.backend.gestorActividades.models.Reserve;
import com.backend.gestorActividades.models.enums.ReserveState;
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

    public List<Reserve> getReserves() {
        return reserveRepository.findAll();
    }
    public Reserve getReserveById(String id) {
        return reserveRepository.findById(id).orElse(null);
    }

    // CREATE RESERVE
    public Reserve createReserve(Reserve reserve) {
        validatePresence(reserve);

        Activity activity = activityRepository.findById(reserve.getActivity().getId())
                .orElseThrow(() -> new RuntimeException("Actividad no encontrada con ID: " + reserve.getActivity().getId()));

        checkTimingConstraint(activity);
        checkDuplicateReserve(reserve.getUser().getId(), activity.getId());
        checkCapacity(activity);

        reserve.setActivity(activity);
        reserve.setReservedAt(LocalDateTime.now());
        reserve.setState(ReserveState.CONFIRMED); // Asegurar el estado inicial
        return reserveRepository.save(reserve);
    }


    // VERIFY PRESENCE OF USER AND ACTIVITY
    private void validatePresence(Reserve reserve) {
        if (reserve.getActivity() == null || reserve.getUser() == null) {
            throw new IllegalArgumentException("The user and activity must be provided for a reservation");
        }
    }

    // CHECK IF THE RESERVATION IS MADE WITH AT LEAST 15 MINUTES IN ADVANCE
    private void checkTimingConstraint(Activity activity) {
        if (Duration.between(LocalDateTime.now(), activity.getDate()).toMinutes() <= 15) {
            throw new IllegalStateException("The reserves must be made at least 15 mins before the activity starts.");
        }
    }

    // CHECK IF THE USER ALREADY HAS A CONFIRMED RESERVATION FOR THE SAME ACTIVITY
    private void checkDuplicateReserve(String userId, String activityId) {
        // ONLY DUPLICATE IF THERE'S AN ACTIVE RESERVATION
        if (reserveRepository.existsByUserIdAndActivityIdAndState(userId, activityId, ReserveState.CONFIRMED)) {
            throw new IllegalStateException("The user already has a confirmed reservation for this activity.");
        }
    }

    // CHECK IF THE ACTIVITY HAS AVAILABLE CAPACITY
    private void checkCapacity(Activity activity) {

        // COUNT CURRENT CONFIRMED RESERVATIONS FOR THE ACTIVITY
        long currentReserves = reserveRepository.countByActivityIdAndState(activity.getId(), ReserveState.CONFIRMED);
        if (currentReserves >= activity.getCapacity()) {
            throw new IllegalStateException("Lo sentimos, la actividad ha alcanzado su cupo máximo.");
        }
    }

    // CANCEL RESERVE
    public Reserve cancelReserve(String id) {

        // GET THE RESERVATION BY ID
        return reserveRepository.findById(id)
                .map(reserve -> {
                    checkTimingConstraint(reserve.getActivity()); // ENSURE THE CANCELLATION IS MADE WITH AT LEAST 15 MINUTES IN ADVANCE
                    reserve.setState(ReserveState.CANCELED); // UPDATE THE STATE TO CANCELED
                    return reserveRepository.save(reserve); // SAVE THE CHANGES TO THE DATABASE
                })
                // IF THE RESERVATION IS NOT FOUND, THROW AN EXCEPTION
                .orElseThrow(() -> new RuntimeException("Reserve not found with ID: " + id));
    }

    // UPDATE RESERVE
    public Reserve updateReserve(String id, Reserve reserve) {
        return reserveRepository.findById(id)
                .map(existing -> {

                    if (!existing.getActivity().getId().equals(reserve.getActivity().getId())) {

                        // NEW ACTIVITY TO UPDATE
                        Activity newActivity = activityRepository.findById(reserve.getActivity().getId())
                                .orElseThrow(() -> new RuntimeException("New activity not found with ID: " + reserve.getActivity().getId()));

                        checkCapacity(newActivity); // VALIDATE THE CAPACITY OF THE NEW ACTIVITY
                        existing.setActivity(newActivity); // UPDATE THE ACTIVITY IN THE RESERVATION            }

                        existing.setUser(reserve.getUser()); // UPDATE THE USER IN THE RESERVATION
                        return reserveRepository.save(existing); // SAVE THE CHANGES TO THE DATABASE
                    }
                    return null;
                })
                    // IF THE RESERVATION IS NOT FOUND, THROW AN EXCEPTION
                .orElseThrow(() -> new RuntimeException("Reserve not found with ID: " + id));
    }

    // DELETE RESERVE
    public void deleteReserve(String id) {
        if (!reserveRepository.existsById(id)) {
            throw new RuntimeException("Reserve not found with ID: " + id);
        }
        reserveRepository.deleteById(id); // DELETE THE RESERVATION FROM THE DATABASE
    }
}