package com.backend.gestorActividades.services;

import com.backend.gestorActividades.models.Activity;
import com.backend.gestorActividades.repositories.IActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class ActivityService {

    @Autowired
    IActivityRepository activityRepository;

    public ArrayList<Activity> getActivities() {
        return (ArrayList<Activity>) activityRepository.findAll();
    }

}