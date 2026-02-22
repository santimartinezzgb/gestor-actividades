import { reactive } from 'vue';

const savedToken = localStorage.getItem('token') || '';
const savedUserId = localStorage.getItem('userId') || '';
const savedUsername = localStorage.getItem('username') || '';
const savedRole = localStorage.getItem('role') || '';

export const userSession = reactive({
    userId: savedUserId,
    username: savedUsername,
    token: savedToken,
    role: savedRole
});

export function setSession(userId: string, username: string, token: string, role: string) {
    userSession.userId = userId;
    userSession.username = username;
    userSession.token = token;
    userSession.role = role;
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
}

export function clearSession() {
    userSession.userId = '';
    userSession.username = '';
    userSession.token = '';
    userSession.role = '';
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
}

export function isAuthenticated(): boolean {
    return !!userSession.token;
}

export function isAdmin(): boolean {
    return userSession.role?.toUpperCase() === 'ADMIN';
}
