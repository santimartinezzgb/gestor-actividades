import { BASE_API_URL } from '../constants/apiConfig';

export const API_URL = `${BASE_API_URL}/auth`;

const TIMEOUT_MS = 10000;

const fetchWithTimeout = (url: string, options: RequestInit, ms = TIMEOUT_MS): Promise<Response> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
};

export const login = async (username: string, password: string) => {
    try {
        const response = await fetchWithTimeout(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        return await response.json();
    } catch (error: any) {
        if (error?.name === 'AbortError') {
            throw new Error('Connection timed out. Check your network and server IP.');
        }
        console.error('Error de inicio de sesión:', error);
        throw error;
    }
};

export const register = async (userData: any) => {
    try {
        const response = await fetchWithTimeout(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }

        return await response.json();
    } catch (error: any) {
        if (error?.name === 'AbortError') {
            throw new Error('Connection timed out. Check your network and server IP.');
        }
        throw error;
    }
};
