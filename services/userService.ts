import { API_URL } from './authService';

const USERS_URL = API_URL.replace('/auth', '/users');

export const getUserById = async (id: string) => {
    try {
        const response = await fetch(`${USERS_URL}/username/${id}`);
        if (!response.ok) {
            throw new Error('Error fetching user profile');
        }
        return await response.json();
    } catch (error) {
        console.error('getUserById error:', error);
        throw error;
    }
};

export const updatePassword = async (id: string, oldPassword: string, newPassword: string) => {
    try {
        const response = await fetch(`${USERS_URL}/${id}/password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ oldPassword, newPassword }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error updating password');
        }

        return true;
    } catch (error) {
        console.error('updatePassword error:', error);
        throw error;
    }
};
