import { reactive } from 'vue';

// RESTAURAR SESIÓN DESDE localStorage SI EXISTE
const savedToken = localStorage.getItem('token') || '';
const savedUserId = localStorage.getItem('userId') || '';
const savedUsername = localStorage.getItem('username') || '';

export const userSession = reactive({
    userId: savedUserId,
    username: savedUsername,
    token: savedToken
});

/**
 * Guarda los datos de sesión en el estado reactivo y en localStorage.
 */
export function setSession(userId: string, username: string, token: string) {
    userSession.userId = userId;
    userSession.username = username;
    userSession.token = token;
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
}

/**
 * Limpia la sesión del estado reactivo y de localStorage.
 */
export function clearSession() {
    userSession.userId = '';
    userSession.username = '';
    userSession.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
}

/**
 * Comprueba si hay una sesión activa (token presente).
 */
export function isAuthenticated(): boolean {
    return !!userSession.token;
}
