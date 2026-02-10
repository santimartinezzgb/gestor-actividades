// Servicio para gestión de usuarios y actividades
const API_URL = 'http://localhost:8080/api';

// Obtener usuarios ROLE_USER
export async function getUsers() {
    const res = await fetch(`${API_URL}/users?role=ROLE_USER`);
    if (!res.ok) throw new Error('Error obteniendo usuarios');
    return await res.json();
}

// Eliminar usuario
export async function deleteUser(id) {
    const res = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error eliminando usuario');
    return await res.json();
}

// Obtener actividades
export async function getActivities() {
    const res = await fetch(`${API_URL}/activities`);
    if (!res.ok) throw new Error('Error obteniendo actividades');
    return await res.json();
}

// Crear actividad
export async function createActivity(activity) {
    const res = await fetch(`${API_URL}/activities/addActivity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity)
    });

    if (!res.ok) {
        // Intentamos extraer el mensaje de error del backend
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error creando actividad');
    }
    return await res.json();
}

// Actualizar actividad
export async function updateActivity(id, activity) {
    const res = await fetch(`${API_URL}/activities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity)
    });
    if (!res.ok) throw new Error('Error actualizando actividad');
    return await res.json();
}

// Eliminar actividad
export async function deleteActivity(id) {
    const res = await fetch(`${API_URL}/activities/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error eliminando actividad');
    return await res.json();
}
