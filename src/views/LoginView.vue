<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { login as loginService } from '../services/authService';

const router = useRouter();
const styleBorder = '2px solid #F7B176';
const changeMode = ref('signin');
const credentials = {
    username: '',
    password: '',
    remember: false
};

const login = async () => {
    if (!credentials.username || !credentials.password) {
        console.error('Please enter both username and password.');
        return;
    }
    try {
        const data = await loginService(credentials);
        console.log('Success:', data);
        // Guardar token según remember
        if (data && data.token) {
            if (credentials.remember) {
                localStorage.setItem('token', data.token);
            } else {
                sessionStorage.setItem('token', data.token);
            }
        }
        // Navigate to Home upon success
        router.push('/home');
    } catch (error) {
        console.error('Error:', error);
    }
};

const goToSignup = () => {
    router.push('/signup');
};

onMounted(async () => {
    const connected = await pingBackend();
    if (!connected) {
        console.error('Unable to connect to the backend');
    } else {
        console.log('Backend connection successful.');
    }
});
</script>

<template>
    <main>

        <div class="sectionTitle">
            <h1>MyFitness</h1>
            <p>Track your activities with ease</p>
        </div>

        <div id="login">
            <section class="options">
                <button
                    class="btn_signin"
                    :style="{ borderBottom: changeMode === 'signin' ? styleBorder : 'none' }"
                    @click="changeMode = 'signin'"
                >Login</button>
                <button
                    class="btn_signup"
                    @click="goToSignup"
                >Sign up</button>
            </section>
            <section class="inputs">
                <input v-model="credentials.username" class="data" type="text" placeholder="Username">
                <input v-model="credentials.password" class="data" type="password" placeholder="Password">

                <section class="sectionRemember">
                    <input type="checkbox" id="remember" v-model="credentials.remember">
                    <label for="remember">Remember me</label>
                </section>
            </section>
            
            <button id="btn_enter" class="btn_enter" @click="login">Enter</button>
        </div>
            
    </main>
</template>

<style scoped>
    main {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 60vh;
        gap: 25rem;
    }
    #login {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
        gap: 2rem;
        width: 100%;
    }
    .options {
        display: flex;
        justify-content: space-evenly;
        width: 100%;
        gap: 2rem;
        margin-bottom: 2rem;
    }
    .btn_signin, .btn_signup {
        padding: 0.3rem;
        font-size: 1.2rem;
        font-weight: 500;
        background-color: transparent;
        color: #FFFFFF;
        cursor: pointer;
        border: none;
    }
    .btn_signin {
        border-bottom: 2px solid transparent;
    }
    .btn_signin:hover, .btn_signup:hover {
        font-weight: bold;
    }
    .sectionTitle {
        margin-bottom: 2rem;
    }
    h1 {
        font-size: 6rem;
        font-weight: 700;
        color: #FFFFFF;
        margin: 0;
    }
    p {
        font-size: 1.5rem;
        font-weight: 500;
        color: #FFFFFF;
        margin: 0;
    }
    .sectionRemember {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.5rem;
        margin: 1rem 0;
    }
    .sectionRemember input {
        width: 20px;
        height: 20px;
        accent-color: #F7B176;
    }
    label {
        font-size: 1.2rem;
        color: #FFFFFF;
    }
    .inputs {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
    }
    .inputs .data {
        padding: 1rem;
        font-size: 1.5rem;
        width: 100%;
        height: 60px;
        border-radius: 0.3rem;
        color: #FFFFFF;
        border: none;
        background-color: #828282;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    }
    .btn_enter {
        padding: 0.7rem;
        font-weight: 600;
        font-size: 1.5rem;
        width: 50%;
        background-color: #F7B176;
        color: rgb(0, 0, 0);    
        border: none;
        border-radius: 0.3rem;
        cursor: pointer;
    }
    .btn_enter:hover {
        opacity: 0.9;
    }
</style>
