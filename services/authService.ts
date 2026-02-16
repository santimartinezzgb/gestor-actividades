// Para el emulador de Android usar 'http://10.0.2.2:8080/api/auth'
// Para dispositivo físico usar la IP del PC (ej. 'http://[IP_ADDRESS]/api/auth')
export const API_URL = 'http://[IP_ADDRESS]/api/auth';

export const login = async (username: string, password: string) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
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
    } catch (error) {
        console.error('Error de inicio de sesión:', error);
        throw error;
    }
};

export const register = async (userData: any) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
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
    } catch (error) {
        console.error('Error de registro:', error);
        throw error;
    }
};
