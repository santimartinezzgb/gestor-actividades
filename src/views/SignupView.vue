<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signup as signupService } from '../services/authService';
const router = useRouter();
const styleBorder = '2px solid #F7B176';

const user = ref({
    username: '',
    password: '',
    confirmPassword: '',
    rol: 'USER',
    isActive: true
});

const signup = async () => {
    if (user.value.password !== user.value.confirmPassword) {
        alert('Las contraseñas no coinciden');
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
        alert('Registro exitoso. Por favor inicia sesión.');
        router.push('/login');
    } catch (error) {
        alert(error.message || 'Error al registrar usuario');
    }
};

const goToLogin = () => {
    router.push('/login');
};
</script>

<template>
    <main>
        <div id="signup">
            <section class="options">
                <button class="btn_signin" @click="goToLogin">Sign in</button>
                <button
                    class="btn_signup"
                    :style="{ borderBottom: styleBorder }"
                >Sign up</button>
            </section>

            <section class="sectionTitle">
                <h1>Join Us</h1>
                <p>Create your account today</p>
            </section>
            
            <section class="inputs">
                <input v-model="user.username" class="datos" type="text" placeholder="Username">
                <input v-model="user.password" class="datos" type="password" placeholder="Password">
                <input v-model="user.confirmPassword" class="datos" type="password" placeholder="Confirm Password">
            </section>
            
            <button id="btn_signup" class="btn_enter" @click="signup">Register</button>
        </div>

        <img src="../assets/main-image.svg" alt="Fitness image" class="image" />
    </main>
</template>

<style scoped>
    main {
        display: flex;
        flex-direction: row;
        width: 100vw;
        height: 100vh;
        background-color: #565656;
        padding-left: 10vw;
    }
    #signup {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 1.5rem;
        width: 40%;
    }
    .options {
        display: flex;
        justify-content: space-between;
        width: 50%;
        gap: 2rem;
        margin-bottom: 2rem;
    }
    .btn_signin, .btn_signup {
        padding: 0.3rem;
        font-size: 1rem;
        font-weight: 500;
        background-color: transparent;
        color: #FFFFFF;
        cursor: pointer;
        border: none;
    }
    .btn_signin:hover, .btn_signup:hover {
        font-weight: bold;
    }
    .image {
        width: 50%;
        object-fit: contain;
    }
    .sectionTitle {
        margin-bottom: 1rem;
    }
    h1 {
        font-size: 5rem;
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
        gap: 1rem;
        width: 80%;
    }
    .inputs .datos {
        padding: 1rem;
        font-size: 1.5rem;
        width: 100%;
        height: 50px;
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
