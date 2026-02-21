<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signup as signupService } from '@/services/auth/authService';
import { z } from 'zod';

// IMPLEMENTAR VALIDACIÓN CON ZOD
// ESQUEMA ZOD PARA VALIDAR REGISTRO
const signupSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

const router = useRouter();
const styleBorder = '2px solid #F7B176';
const errors = ref({});
const serverError = ref('');
const successMsg = ref('');

const user = ref({
    username: '',
    password: '',
    confirmPassword: '',
});

const signup = async () => {
    
    // LIMPIAR MENSAJES ANTERIORES
    serverError.value = '';
    successMsg.value = '';

    // VALIDAR CON ZOD
    const result = signupSchema.safeParse(user.value);

    if (!result.success) {
        errors.value = {};
        result.error.errors.forEach(err => {
            errors.value[err.path[0]] = err.message;
        });
        return;
    }

    // LIMPIAR ERRORES DE VALIDACIÓN
    errors.value = {};

    const userToSend = {
        username: user.value.username,
        password: user.value.password,
        rol: 'USER',
        isActive: true
    };
    try {
        await signupService(userToSend);
        successMsg.value = 'Registration successful! Redirecting to login...';
        setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
        serverError.value = error.message || 'Registration failed. Please try again.';
    }
};

const goToLogin = () => router.push('/login');
</script>

<template>

    <main>
        <div class="sectionTitle">
            <h1>MyFitness</h1>
            <p>Track your activities with ease</p>
        </div>
        <div id="signup">
            <section class="options">
                <button
                    class="btn_signin"
                    @click="goToLogin"
                >Login</button>
                <button
                    class="btn_signup"
                    :style="{ borderBottom: styleBorder }"
                >Sign up</button>
            </section>

            <section class="inputs">
                <input v-model="user.username" class="data" type="text" placeholder="Username">
                <div v-if="errors.username" class="fieldError">{{ errors.username }}</div>

                <input v-model="user.password" class="data" type="password" placeholder="Password (min 6 chars)">
                 <div v-if="errors.password" class="fieldError">{{ errors.password }}</div>
                <div v-if="errors.password" class="fieldError">{{ errors.password }}</div>

                <input v-model="user.confirmPassword" class="data" type="password" placeholder="Confirm Password">
                <div v-if="errors.confirmPassword" class="fieldError">{{ errors.confirmPassword }}</div>

                <div v-if="serverError" class="serverError">{{ serverError }}</div>
                <div v-if="successMsg" class="successMsg">{{ successMsg }}</div>
            </section>

            <button id="btn_signup" class="btn_enter" @click="signup">Register</button>
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
    #signup {
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
    }
    .btn_signin, .btn_signup {
        padding: 0.3rem;
        font-size: 1.2rem;
        font-weight: 500;
        background-color: transparent;
        color: #FFFFFF;
        cursor: pointer;
        border: none;
        transition: all 0.3s ease;
    }
    .btn_signin:hover, .btn_signup:hover {
        transform: translateY(-5px);
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
    .inputs {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
        gap: 1rem;
        width: 100%;
    }
    .inputs .data {
        padding: 1rem;
        font-size: 1.5rem;
        width: 100%;
        height: 60px;
        border-radius: 1rem;
        color: #FFFFFF;
        background-color: #828282;
        box-shadow: 0px 4px 4px #00000040;
        border-left: #F7B176 4px none;
    }

    .inputs .data::placeholder {
        color: #FFFFFF;
        opacity: 0.5;
    }
    .inputs .data:focus {
        padding: 0.9rem;
        outline: none;
        border-left: #F7B176 4px solid;
    }
    .btn_enter {
        padding: 0.7rem;
        font-weight: 600;
        font-size: 1.5rem;
        width: 50%;
        background-color: #F7B176;
        color: #000000;    
        border: none;
        border-radius: 1rem;
        cursor: pointer;
    }
    .btn_enter:hover {
        opacity: 0.9;
    }
    .fieldError {
        color: #ff6b6b;
        font-size: 0.85rem;
        font-weight: 600;
        width: 100%;
        text-align: left;
        margin-top: -0.5rem;
        display: block;
    }
    .serverError {
        color: #ff6b6b;
        font-size: 0.95rem;
        font-weight: 600;
        text-align: center;
        width: 100%;
        background: #FF6B6B1A;
        padding: 10px 15px;
        border-radius: 6px;
        border: 1px solid #FF6B6B4C;
        box-sizing: border-box;
    }
    .successMsg {
        color: #4caf50;
        font-size: 0.95rem;
        font-weight: 600;
        text-align: center;
        width: 100%;
        background: #4CAF501A;
        padding: 10px 15px;
        border-radius: 6px;
        border: 1px solid #4CAF504C;
        box-sizing: border-box;
    }
</style>
