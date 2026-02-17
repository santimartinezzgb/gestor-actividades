// CONFIGURACIÓN
const API_URL = 'http://localhost:8080/api/auth';

// SERVICIO DE REGISTRO PARA MANEJAR EL REGISTRO DE USUARIOS
export async function signup(user: {
    username: string;
    password: string;
    rol?: string;
    isActive?: boolean;
}) {
    const respuesta = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error during registration');
    }
    return await respuesta.json();
}

// SERVICIO DE LOGIN PARA MANEJAR LA LÓGICA DE INICIO DE SESIÓN
export async function login(credentials: {
    username: string;
    password: string;
}) {
    const respuesta = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });

    if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => ({}));
        throw new Error(errorData.message || 'Incorrect credentials');
    }

    return await respuesta.json();
}

