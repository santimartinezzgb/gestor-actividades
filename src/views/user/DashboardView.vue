<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const sections = [
    { id: 'profile', title: 'My Profile', icon: '👤', route: '/user/profile' },
    { id: 'reserves', title: 'My Reserves', icon: '📅', route: '/user/reserves' },
    { id: 'activities', title: 'Activities', icon: '🏋️', route: '/user/activities' },
];

const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
};
</script>

<template>
    <main>
        <div class="overlay">
            <h1 class="header-title">MY DASHBOARD</h1>

            <div class="panel-options">
                <button
                    v-for="section in sections"
                    :key="section.id"
                    class="card"
                    @click="router.push(section.route)"
                >
                    <div class="icon-circle">
                        <span class="icon">{{ section.icon }}</span>
                    </div>
                    <span class="card-title">{{ section.title }}</span>
                </button>
            </div>

            <button class="logout-button" @click="logout">
                🚪 Logout
            </button>
        </div>
    </main>
</template>

<style scoped>
main {
    width: 100vw;
    height: 100vh;
    background-color: #121212;
}
.overlay {
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 80px;
}
.header-title {
    font-size: 2.5rem;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 60px;
    letter-spacing: 2px;
}
.panel-options {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 24px;
    max-width: 700px;
}
.card {
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.15);
    cursor: pointer;
    transition: all 0.3s ease;
    color: white;
}
.card:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-4px);
    border-color: #F7B176;
}
.icon-circle {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: rgba(247, 177, 118, 0.15);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 14px;
}
.icon {
    font-size: 2rem;
}
.card-title {
    font-size: 1rem;
    font-weight: 600;
    color: #ffffff;
}
.logout-button {
    position: absolute;
    bottom: 50px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 30px;
    border-radius: 25px;
    border: 1px solid #ff6b6b;
    background: transparent;
    color: #ff6b6b;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
}
.logout-button:hover {
    background: rgba(255, 107, 107, 0.15);
}
</style>
