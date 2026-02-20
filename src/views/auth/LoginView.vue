<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/services/auth/authService';
import { setSession } from '@/services/auth/session';
import { z } from 'zod';

// IMPLEMENTAR VALIDACIÓN CON ZOD
// ESQUEMA DE VALIDACIÓN PARA LOGIN
const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

const styleBorder = '2px solid #F7B176';
const router = useRouter();
const errors = ref({});
const errorMessage = ref('');
const loading = ref(false);
const credentials = reactive({
    username: '',
    password: '',
});

const handleLogin = async () => {
    const result = loginSchema.safeParse(credentials);
    if (!result.success) {
        errors.value = {};
        result.error.errors.forEach(err => {
            errors.value[err.path[0]] = err.message;
        });
        return;
    }

    errors.value = {};
    loading.value = true;
    errorMessage.value = '';

    try {
        const data = await login(credentials);

        // GUARDAR DATOS EN SESIÓN (reactivo + localStorage)
        setSession(data.userId, data.username, data.token);

        // REDIRECCIONAR SEGÚN ROL ( ADMIN O USER )
        if (data.role?.toUpperCase() === 'ADMIN') {
            router.push('/admin');
        } else {
            router.push('/user');
        }
    } catch (error) {
        errorMessage.value = error.message || "Incorrect username or password";
    } finally {
        loading.value = false;
    }
};

const goToSignup = () => router.push('/signup');
</script>

<template>
    <main>
        <div class="sectionTitle">
            <h1>MyFitness</h1>
            <p>Track your activities with ease</p>
        </div>

        <div id="login">
            <form @submit.prevent="handleLogin" style="width:100%">
                <section class="options">
                    <button type="button" class="btn_signin" :style="{ borderBottom: styleBorder }">Login</button>
                    <button type="button" class="btn_signup" @click="goToSignup">Sign up</button>
                </section>

                <section class="inputs">
                    <input v-model="credentials.username" class="data" type="text" placeholder="Username">
                    <span v-if="errors.username" class="field-error">{{ errors.username }}</span>

                    <input v-model="credentials.password" class="data" type="password" placeholder="Password">
                    <span v-if="errors.password" class="field-error">{{ errors.password }}</span>

                    <button class="btn_enter" type="submit" :disabled="loading">
                        {{ loading ? 'Loading...' : 'Enter' }}
                    </button>
                    <span v-if="errorMessage" class="loginError">{{ errorMessage }}</span>
                </section>
            </form>
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
        position: relative;
    }
    .inputs .data {
        padding: 1rem;
        font-size: 1.5rem;
        width: 100%;
        height: 60px;
        border-radius: 1rem;
        color: #FFFFFF;
        background-color: #828282;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
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
        color: rgb(0, 0, 0);    
        border: none;
        border-radius: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 1rem;
    }
    .btn_enter:hover {
        opacity: 0.9;
        transform: translateY(5px);
    }
    .field-error {
        color: #ff6b6b;
        font-size: 0.85rem;
        font-weight: 500;
        align-self: flex-start;
        margin-top: -0.5rem;
    }
    .loginError {
        position: relative;
        top: 240px;
        left: 30%;
        color: #ff6b6b;
        font-size: 1rem;
        font-weight: 700;
        width: 100%;
        text-align: center;
        position: absolute;
    }
</style>
