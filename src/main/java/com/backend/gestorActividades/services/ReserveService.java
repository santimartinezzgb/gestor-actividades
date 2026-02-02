
package com.backend.gestorActividades.services;

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
        // VARIABLES
        LocalDateTime activityDate = reserve.getActivity().getDate();
        LocalDateTime now = LocalDateTime.now();
        Duration difference = Duration.between(now, activityDate);
        int minutesLimit = 15;

        // DATA VALIDATIONS
        // Check if the activity has available capacity
        if(reserve.getActivity().getCapacity() >= activityRepository.findByCapacity(reserve.getActivity().getCapacity()).size()) {
            throw new IllegalArgumentException("The activity is full. Cannot create reserve.");
        }
        // Check that the activity can still be booked (at least 15 minutes before it starts)
        if(difference.toMinutes() <= minutesLimit) {
            throw new IllegalArgumentException("The activity cannot be booked less than 15 minutes before it starts.");
        }
        // Check that the user does not have another reservation for the same activity
        ArrayList<Reserve> existingReserves = getReserves();
        if(existingReserves.contains(reserve)){
            throw new IllegalArgumentException("The user already has a reservation for this activity.");
        }

        return reserveRepository.save(reserve);
    }

    public ArrayList<Reserve> getReserves() {
        return (ArrayList<Reserve>) reserveRepository.findAll();
    }
    public Reserve getReserveById(Long id) {
        return reserveRepository.findById(id).orElse(null);
    }

    public Reserve updateReserve(Long id, Reserve reserve) {
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

    public void deleteReserve(Long id) {
        Optional<Reserve> removedReserve = reserveRepository.findById(id);
        removedReserve.ifPresent(reserveRepository::delete);
    }

}