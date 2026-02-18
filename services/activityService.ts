import { BASE_API_URL } from '../constants/apiConfig';
import { userSession } from './session';
export const ACTIVITIES_URL = `${BASE_API_URL}/activities`;

export const getActivities = async () => {
    try {
        const response = await fetch(ACTIVITIES_URL, {
            headers: {
                'Authorization': `Bearer ${userSession.token}`
            }
        });
        if (!response.ok) {
            throw new Error('Error fetching activities');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getActivities:', error);
        throw error;
    }
};

export const createActivity = async (activity: any) => {
    try {
        const response = await fetch(`${ACTIVITIES_URL}/addActivity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userSession.token}`
            },
            body: JSON.stringify(activity),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error creating activity');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en createActivity:', error);
        throw error;
    }
};

export const updateActivity = async (id: string, activity: any) => {
    try {
        const response = await fetch(`${ACTIVITIES_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userSession.token}`
            },
            body: JSON.stringify(activity),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message);
        }

        return await response.json();
    } catch (error) {
        console.error('Error en updateActivity:', error);
        throw error;
    }
};

export const deleteActivity = async (id: string) => {
    try {
        const response = await fetch(`${ACTIVITIES_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${userSession.token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message);
        }

        return await response.json();
    } catch (error) {
        console.error('Error en deleteActivity:', error);
        throw error;
    }
};
