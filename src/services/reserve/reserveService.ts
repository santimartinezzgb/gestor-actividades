const API_URL = 'http://localhost:8080/api/reserves';

export const getReserves = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error fetching reservations');
    return await response.json();
};

export const createReserve = async (userId: string, activityId: string) => {
    const response = await fetch(API_URL, {
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
        throw new Error(errorData.message);
    }
    return await response.json();
};

export const cancelReserve = async (id: string) => {
    const response = await fetch(`${API_URL}/${id}/cancel`, {
        method: 'PATCH',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message);
    }
    return await response.json();
};
