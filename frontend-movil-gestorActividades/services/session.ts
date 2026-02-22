// SESIÓN DEL USUARIO AUTENTICADO (almacena datos + token JWT)

export let userSession = {
    userId: '',
    username: '',
    token: '',
    role: ''
};

/**
 * Guarda los datos de sesión en el objeto mutable.
 */
export function setSession(userId: string, username: string, token: string, role: string) {
    userSession.userId = userId;
    userSession.username = username;
    userSession.token = token;
    userSession.role = role;
}

/**
 * Limpia la sesión del usuario.
 */
export function clearSession() {
    userSession.userId = '';
    userSession.username = '';
    userSession.token = '';
    userSession.role = '';
}

/**
 * Comprueba si hay una sesión activa (token JWT presente).
 */
export function isAuthenticated(): boolean {
    return !!userSession.token;
}

/**
 * Devuelve true si el usuario tiene rol ADMIN.
 */
export function isAdmin(): boolean {
    return userSession.role?.toUpperCase() === 'ADMIN';
}
