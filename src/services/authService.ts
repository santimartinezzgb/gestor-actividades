const API_URL = 'http://localhost:8080/api/v1/auth';


// Función para comprobar conexión con el backend
export async function pingBackend() {
    try {
        // Hacemos una petición a un login parcial o simplemente al base path
        // Si el backend responde (aunque sea con error de método), está vivo.
        const res = await fetch(API_URL + '/login', { method: 'OPTIONS' });
        return true;
    } catch {
        return false;
    }
}

// Servicio de autenticación para manejar la lógica de login
export async function login(
    credentials: {
        username: string;
        password: string;
        remember?: boolean
    }) {
    try {
        const respuesta = await fetch(API_URL + '/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (respuesta.ok) {
            return await respuesta.json();
        } else {
            const errorData = await respuesta.json();
            throw new Error(errorData.message || 'Incorrect credentials');
        }
    } catch (error) {
        throw new Error('Could not connect to the server. Is Spring Boot running?');
    }
}

