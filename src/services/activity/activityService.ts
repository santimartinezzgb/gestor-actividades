import { userSession } from '../auth/session';

const API_URL = 'http://localhost:8080/api/activities';

export const getActivities = async () => {
    const response = await fetch(API_URL, {
        headers: {
            'Authorization': `Bearer ${userSession.token}`
        }
    });
    if (!response.ok) throw new Error('Error fetching activities');
    return await response.json();
};

export const createActivity = async (activity: any) => {
    const response = await fetch(`${API_URL}/addActivity`, {
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
};

export const updateActivity = async (id: string, activity: any) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userSession.token}`
        },
        body: JSON.stringify(activity),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error updating activity');
    }
    return await response.json();
};

export const deleteActivity = async (id: string) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${userSession.token}`
        }
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error deleting activity');
    }
    return await response.json();
};
