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
        throw new Error(errorData.message || 'Registration failed');
    }
    const text = await respuesta.text(); // MANEJO DE RESPUESTA VACÍA
    return text ? JSON.parse(text) : {}; // DEVOLVER OBJETO VACÍO SI NO HAY CONTENIDO
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
        throw new Error(errorData.message);
    }

    return await respuesta.json();
}

