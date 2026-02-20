import { userSession } from '../auth/session';

const API_URL = 'http://localhost:8080/api/users';

export const getUserById = async (id: string) => {
    const response = await fetch(`${API_URL}/username/${id}`, {
        headers: {
            'Authorization': `Bearer ${userSession.token}`
        }
    });
    if (!response.ok) throw new Error('Error fetching user profile');
    return await response.json();
};

export const updatePassword = async (id: string, oldPassword: string, newPassword: string) => {
    const response = await fetch(`${API_URL}/${id}/password`, {
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
};

export const getUsers = async (role?: string) => {
    const url = role ? `${API_URL}?role=${role}` : API_URL;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${userSession.token}`
        }
    });
    if (!response.ok) throw new Error('Error fetching users');
    return await response.json();
};

export const deleteUser = async (id: string) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${userSession.token}`
        }
    });
    if (!response.ok) throw new Error('Error deleting user');
    return true;
};
