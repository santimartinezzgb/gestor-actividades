// For Android emulator use 'http://10.0.2.2:8080/api/auth'
// For physical device use your PC's IP (e.g. 'http://192.168.1.172:8080/api/auth')
export const API_URL = 'http://10.0.2.2:8080/api/auth';

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
            throw new Error(errorData.message || 'Error logging in');
        }

        return await response.json();
    } catch (error) {
        console.error('Login error:', error);
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
            throw new Error(errorData.message || 'Error registering user');
        }

        return await response.json();
    } catch (error) {
        console.error('Register error:', error);
        throw error;
    }
};
