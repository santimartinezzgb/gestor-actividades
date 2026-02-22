<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signup as signupService } from '@/services/auth/authService';
import { z } from 'zod';

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
const authError = ref('');
const successMsg = ref('');

const user = ref({
    username: '',
    password: '',
    confirmPassword: '',
});

const signup = async () => {
    
    authError.value = '';
    successMsg.value = '';

    const result = signupSchema.safeParse(user.value);
    if (!result.success) {
        authError.value = result.error.issues[0]?.message ?? 'Please fill the form correctly.';
        return;
    }

    const userToSend = {
        username: user.value.username,
        password: user.value.password,
        rol: 'USER',
        isActive: true
    };
    try {
        await signupService(userToSend);
        successMsg.value = 'Registration successful!';
        setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
        authError.value = error?.message ?? 'Registration failed. Please try again.';
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

                <input v-model="user.password" class="data" type="password" placeholder="Password (min 6 chars)">

                <input v-model="user.confirmPassword" class="data" type="password" placeholder="Confirm Password">

                <button id="btn_signup" class="btn_enter" @click="signup">Register</button>
                <div v-if="authError" class="authError" role="alert" aria-live="assertive">{{ authError }}</div>
                <div v-if="successMsg" class="successMsg">{{ successMsg }}</div>
            </section>
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
        align-items: flex-end;
        gap: 2rem;
        width: 100%;
        height: 60vh;
    }
   .options {
        display: flex;
        justify-content: space-evenly;
        width: 100%;
        gap: 2rem;
        margin-bottom: 5rem;
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
        align-items: stretch;
        gap: 1rem;
        width: 100%;
        box-sizing: border-box;
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
        margin-top: 2rem;
        align-self: flex-end;
    }
    .btn_enter:hover {
        opacity: 0.9;
    }
    .authError {
        border-radius: 5px;
        color: #ff6b6b;
        font-size: 1rem;
        font-weight: 600;
        text-align: center;
        background: #FF6B6B1A;
        padding: 10px 15px;
        width: 50%;
        align-self: flex-end;
    }
    .successMsg {
        color: #4caf50;
        background: #4CAF501A;
        border-radius: 5px;
        font-size: 1rem;
        font-weight: 600;
        text-align: center;
        padding: 10px 15px;
        width: 50%;
        align-self: flex-end;
    }
</style>
