// SESIÓN DEL USUARIO AUTENTICADO (almacena datos + token JWT)

export let userSession = {
    userId: '',
    username: '',
    token: ''
};

/**
 * Guarda los datos de sesión en el objeto mutable.
 */
export function setSession(userId: string, username: string, token: string) {
    userSession.userId = userId;
    userSession.username = username;
    userSession.token = token;
}

/**
 * Limpia la sesión del usuario.
 */
export function clearSession() {
    userSession.userId = '';
    userSession.username = '';
    userSession.token = '';
}

/**
 * Comprueba si hay una sesión activa (token JWT presente).
 */
export function isAuthenticated(): boolean {
    return !!userSession.token;
}
