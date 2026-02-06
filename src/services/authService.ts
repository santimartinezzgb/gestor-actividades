const API_URL = 'http://localhost:8080/';


// Función para comprobar conexión con el backend
export async function pingBackend() {
    try {
        const res = await fetch(API_URL, { method: 'GET' });
        return res.ok;
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
        const respuesta = await fetch(API_URL, {
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
