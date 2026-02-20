import { BASE_API_URL } from '../constants/apiConfig';
import { userSession } from './session';

export const RESERVES_URL = `${BASE_API_URL}/reserves`;

export const getReserves = async () => {
    try {
        const response = await fetch(RESERVES_URL, {
            headers: {
                'Authorization': `Bearer ${userSession.token}`
            }
        });
        if (!response.ok) {
            throw new Error('Error fetching reservations');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getReserves:', error);
        throw error;
    }
};

export const createReserve = async (userId: string, activityId: string) => {
    try {
        const response = await fetch(RESERVES_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userSession.token}`
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
            throw new Error(errorData.message);
        }

        return await response.json();
    } catch (error) {
        console.error('Error en createReserve:', error);
        throw error;
    }
};

export const cancelReserve = async (id: string) => {
    try {
        const response = await fetch(`${RESERVES_URL}/${id}/cancel`, {
            method: 'PATCH',
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
        console.error('Error en cancelReserve:', error);
        throw error;
    }
};
