export const BASE_API_URL = 'http://192.168.1.172:8080/api';
export const ACTIVITIES_URL = `${BASE_API_URL}/activities`;

export const getActivities = async () => {
    try {
        const response = await fetch(ACTIVITIES_URL);
        if (!response.ok) {
            throw new Error('Error fetching activities');
        }
        return await response.json();
    } catch (error) {
        console.error('getActivities error:', error);
        throw error;
    }
};

export const createActivity = async (activity: any) => {
    try {
        const response = await fetch(`${ACTIVITIES_URL}/addActivity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(activity),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error creating activity');
        }

        return await response.json();
    } catch (error) {
        console.error('createActivity error:', error);
        throw error;
    }
};

export const updateActivity = async (id: string, activity: any) => {
    try {
        const response = await fetch(`${ACTIVITIES_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(activity),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error updating activity');
        }

        return await response.json();
    } catch (error) {
        console.error('updateActivity error:', error);
        throw error;
    }
};

export const deleteActivity = async (id: string) => {
    try {
        const response = await fetch(`${ACTIVITIES_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error deleting activity');
        }

        return await response.json();
    } catch (error) {
        console.error('deleteActivity error:', error);
        throw error;
    }
};
