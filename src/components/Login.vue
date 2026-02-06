<script setup>

import { ref, onMounted } from 'vue';
import { login as loginService, pingBackend } from '../services/authService';

const styleBorder = '2px solid #F7B176';
const changeMode = ref('signin');
const credentials = {
    username: '',
    password: '',
    remember: false
};


const login = async () => {
    if (!credentials.username || !credentials.password) {
        alert('Please enter both username and password.');
        return;
    }
    try {
        const data = await loginService(credentials);
        console.log('Success:', data);
        alert(`Welcome, ${credentials.username}!`);
    } catch (error) {
        alert(error.message);
    }
};

onMounted(async () => {
    const connected = await pingBackend();
    if (!connected) {
        alert(`Unable to connect to the backend`);
    } else {
        console.log('Backend connection successful.');
    }
});

</script>

<template>
    <main>
        <div id="login">

            <section class="options">
                    <button
                        class="btn_signin"
                        :style="{ borderBottom: changeMode === 'signin' ? styleBorder : 'none' }"
                        @click="changeMode = 'signin'"
                    >Sign in</button>
                    <button
                        class="btn_signup"
                        :style="{ borderBottom: changeMode === 'signup' ? styleBorder : 'none' }"
                        @click="changeMode = 'signup'"
                    >Sign up</button>
            </section>

            <section class="sectionTitle">
                <h1>MyFitness</h1>
                <p>This is going to be a slogan</p>
            </section>
            
            <section class="inputs">
                <input v-model="credentials.username" class="datos" type="text" placeholder="Username">
                <input v-model="credentials.password" class="datos" type="password" placeholder="Password">

                <section class="sectionRemember">
                    <input type="checkbox" id="remember" v-model="credentials.remember">
                    <label for="remember">Remember me</label>
                </section>

            </section>
            
            <button id="btn_enter" class="btn_enter" @click="login">Enter</button>
        </div>

        <img src="../assets/main-image.svg" alt="Fitness image" class="image" />

    </main>
</template>

<style scoped>
    main {
        display: flex;
        flex-direction: row;
        width: 80vw;
        height: 100vh;
    }
    #login {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 2rem;
        width: 80%;
    }
    .options {
        display: flex;
        justify-content: space-between;
        width: 50%;
        gap: 2rem;
        margin-bottom: 2rem;
    }
    .btn_signin {
        padding: 0.3rem;
        font-size: 1rem;
        font-weight: 500;
        width: 40%;
        background-color: transparent;
        color: #FFFFFF;
        cursor: pointer;
        
        border: styleBorder;
        border-top: none;
        border-left: none;
        border-right: none;
    }
    .btn_signup {
        padding: 0.3rem;
        font-size: 1rem;
        font-weight: 500;
        width: 40%;
        background-color: transparent;
        color: #FFFFFF;
        cursor: pointer;

        border: styleBorder;
        border-top: none;
        border-left: none;
        border-right: none;
        border-bottom: none;
    }

    .btn_signin:hover, .btn_signup:hover {
        font-weight: bold;
    }

    .image {
        width: 64%;
        object-fit: contain;
    }

    .sectionTitle {
        margin-bottom: 2rem;
    }
    h1 {
        font-size: 5rem;
        font-weight: 700;
        color: #FFFFFF;
    }
    p {
        font-size: 1.5rem;
        font-weight: 500;
        color: #FFFFFF;
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
    }
    .inputs .datos {
        padding: 1rem;
        font-size: 1.5rem;
        width: 100%;
        height: 8vh;
        border-radius: 0.3rem;
       color: #FFFFFF;
        border: none;
        background-color: #828282;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    }
    .inputs .datos:focus {
        outline: none;
        box-shadow: 0px 0px 5px #F7B176;
    }
    .sectionRemember {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 1rem 0;
    }
    .btn_enter {
        padding: 0.7rem;
        font-weight: 600;
        font-size: 1.5rem;
        width: 35%;
        background-color: #F7B176;
        color: rgb(0, 0, 0);    
        border: none;
        border-radius: 0.3rem;
        cursor: pointer;
    }
    .btn_enter:hover {
        opacity: 0.9;
        outline: none;
        box-shadow: 0px 0px 5px #F7B176;
    }
</style>