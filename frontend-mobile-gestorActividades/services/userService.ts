import { BASE_API_URL } from '../constants/apiConfig';
import { userSession } from './session';

const USERS_URL = `${BASE_API_URL}/users`;

export const getUserById = async (id: string) => {
    try {
        const response = await fetch(`${USERS_URL}/username/${id}`, {
            headers: {
                'Authorization': `Bearer ${userSession.token}`
            }
        });
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
                'Authorization': `Bearer ${userSession.token}`
            },
            body: JSON.stringify({ oldPassword, newPassword }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        return true;
    } catch (error) {
        console.error('updatePassword error:', error);
        throw error;
    }
};

export const getUsers = async (role?: string) => {
    try {
        const url = role ? `${USERS_URL}?role=${role}` : USERS_URL;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${userSession.token}`
            }
        });
        if (!response.ok) throw new Error('Error fetching users');
        return await response.json();
    } catch (error) {
        console.error('getUsers error:', error);
        throw error;
    }
};

export const deleteUser = async (id: string) => {
    try {
        const response = await fetch(`${USERS_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${userSession.token}`
            }
        });
        if (!response.ok) throw new Error('Error deleting user');
        return true;
    } catch (error) {
        console.error('deleteUser error:', error);
        throw error;
    }
};
