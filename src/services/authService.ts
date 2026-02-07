const API_URL = 'http://localhost:8080/api/auth';


// CHECK CONNECTION WITH THE BACKEND
export async function pingBackend() {
    try {
        // TRY TO CONNECT TO THE BACKEND
        const res = await fetch(API_URL + '/login', { method: 'OPTIONS' });
        return true;
    } catch {
        return false;
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
        const respuesta = await fetch(API_URL + '/login', {
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
        throw new Error('Could not connect to the server. Is Spring Boot running?');
    }
}

