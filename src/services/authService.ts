// CONFIGURATION
const API_URL = 'http://localhost:8080/api/auth';
const methodLogin_API = '/login'; // ENDPOINT FOR USER LOGIN FROM THE BACKEND
const methodRegister_API = '/register'; // ENDPOINT FOR USER REGISTRATION FROM THE BACKEND

// SIGNUP SERVICE TO HANDLE USER REGISTRATION
export async function signup(user: {
    username: string;
    password: string;
    rol?: string;
    isActive?: boolean;
}) {
    try {
        const respuesta = await fetch(API_URL + methodRegister_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        if (respuesta.ok) {
            return await respuesta.json();
        } else {
            const errorData = await respuesta.json();
            throw new Error(errorData.message || 'Error during registration');
        }
    } catch (error) {
        throw new Error('Could not connect to the server. Is backend running?');
    }
}


// LOGIN SERVICE TO HANDLE THE LOGIN LOGIC
export async function login(
    credentials: {
        username: string;
        password: string;
        remember?: boolean
    }) {
    try { // TRY TO CONNECT TO THE BACKEND
        const respuesta = await fetch(API_URL + methodLogin_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (respuesta.ok) {
            console.log("Login ok: ", respuesta);
            return await respuesta.json(); // RETURN THE RESPONSE FROM THE BACKEND

        } else {
            console.log("Login fail: ", respuesta);
            const errorData = await respuesta.json();
            throw new Error(errorData.message || 'Incorrect credentials');
        }
    } catch (error) {
        throw new Error('Could not connect to the server. Is backend running?');
    }
}

