import { ACTIVITIES_URL, BASE_API_URL } from './activityService';

export const RESERVES_URL = `${BASE_API_URL}/reserves`;

export const getReserves = async () => {
    try {
        const response = await fetch(RESERVES_URL);
        if (!response.ok) {
            throw new Error('Error fetching reserves');
        }
        return await response.json();
    } catch (error) {
        console.error('getReserves error:', error);
        throw error;
    }
};

export const createReserve = async (userId: string, activityId: string) => {
    try {
        const response = await fetch(RESERVES_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: { id: userId },
                activity: { id: activityId },
                reservedAt: new Date().toISOString().slice(0, 19),
                state: 'CONFIRMED'
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error creating reserve');
        }

        return await response.json();
    } catch (error) {
        console.error('createReserve error:', error);
        throw error;
    }
};

export const cancelReserve = async (id: string) => {
    try {
        const response = await fetch(`${RESERVES_URL}/${id}/cancel`, {
            method: 'PATCH',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error cancelling reserve');
        }

        return await response.json();
    } catch (error) {
        console.error('cancelReserve error:', error);
        throw error;
    }
};
