<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signup as signupService } from '../services/authService';

const router = useRouter();
const styleBorder = '2px solid #F7B176';
const activeView = ref('signup');
const errorMessage = ref(''); // TO DISPLAY LOGIN ERRORS.

const user = ref({
    username: '',
    password: '',
    confirmPassword: '',
    rol: 'USER',
    isActive: true
});

const signup = async () => {
    if (user.value.password !== user.value.confirmPassword) {
        errorMessage.value = "Passwords do not match";
        alert('Passwords do not match');
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
        alert('Registration successful! Please log in.');
        router.push('/login');
    } catch (error) {
        alert(error.message || 'Registration failed. Please try again.');
    }
};

const goToLogin = () => {
    activeView.value = 'login';
    router.push('/login');
};
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
                    :style="{ borderBottom: activeView === 'login' ? styleBorder : 'none' }"
                    @click="goToLogin"
                >Login</button>
                <button
                    class="btn_signup"
                    :style="{ borderBottom: activeView === 'signup' ? styleBorder : 'none' }"
                >Sign up</button>
            </section>

            <section class="inputs">
                <input v-model="user.username" class="data" type="text" placeholder="Username">
                <input v-model="user.password" class="data" type="password" placeholder="Password">
                <input v-model="user.confirmPassword" class="data" type="password" placeholder="Confirm Password">
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
        border-radius: 0.3rem;
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
        border-radius: 0.3rem;
        cursor: pointer;
    }
    .btn_enter:hover {
        opacity: 0.9;
    }
</style>
