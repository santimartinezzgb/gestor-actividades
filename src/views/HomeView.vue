<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
    router.push('/login');
};

const goToExtra1 = () => router.push('/extra1');
const goToExtra2 = () => router.push('/extra2');
</script>

<template>
    <main>
        <nav class="sidebar">
            <h2>Dashboard</h2>
            <ul>
                <li @click="goToExtra1">Activities</li>
                <li @click="goToExtra2">Reservations</li>
                <li @click="logout" class="logout">Logout</li>
            </ul>
        </nav>
        <section class="content">
            <h1>Principal Screen</h1>
            <p>Welcome to your fitness manager!</p>
            <div class="cards">
                <div class="card" @click="goToExtra1">Manage Activities</div>
                <div class="card" @click="goToExtra2">My Reservations</div>
            </div>
        </section>
    </main>
</template>

<style scoped>
    main {
        display: flex;
        width: 100vw;
        height: 100vh;
        background-color: #333;
        color: white;
    }
    .sidebar {
        width: 250px;
        background-color: #222;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        border-right: 2px solid #F7B176;
    }
    .sidebar h2 {
        color: #F7B176;
        margin-bottom: 2rem;
    }
    .sidebar ul {
        list-style: none;
        padding: 0;
    }
    .sidebar li {
        padding: 1rem 0;
        cursor: pointer;
        font-size: 1.2rem;
        transition: color 0.3s;
    }
    .sidebar li:hover {
        color: #F7B176;
    }
    .logout {
        margin-top: auto;
        color: #ff6b6b;
    }
    .content {
        flex: 1;
        padding: 4rem;
    }
    h1 {
        font-size: 4rem;
        margin-bottom: 1rem;
    }
    .cards {
        display: flex;
        gap: 2rem;
        margin-top: 3rem;
    }
    .card {
        background-color: #444;
        padding: 2rem;
        border-radius: 1rem;
        flex: 1;
        text-align: center;
        font-size: 1.5rem;
        cursor: pointer;
        border: 2px solid transparent;
        transition: 0.3s;
    }
    .card:hover {
        border-color: #F7B176;
        background-color: #555;
    }
</style>
