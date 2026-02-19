<script setup lang="ts">
import { ref, markRaw } from 'vue';
import { useRouter } from 'vue-router';
import { User, Calendar, Dumbbell, LogOut } from 'lucide-vue-next';

const router = useRouter();

const sections = [
    { id: 'profile', title: 'My Profile', icon: markRaw(User), route: '/user/profile' },
    { id: 'reserves', title: 'My Reserves', icon: markRaw(Calendar), route: '/user/reserves' },
    { id: 'activities', title: 'Activities', icon: markRaw(Dumbbell), route: '/user/activities' },
];

// CERRAR SESIÓN
const logout = () => {
    localStorage.removeItem('token'); // ELIMINAR TOKEN
    router.push('/login');
};
</script>

<template>
    <main>
        <div class="main">
            <h1 class="headerTitle">MY DASHBOARD</h1>

            <div class="panelOptions">
                <button
                    v-for="section in sections"
                    :key="section.id"
                    class="card"
                    @click="router.push(section.route)"
                >
                    <div class="iconCircle">
                        <component :is="section.icon" :size="32" color="#F7B176" />
                    </div>
                    <span class="cardTitle">{{ section.title }}</span>
                </button>
            </div>

            <button class="logoutButton" @click="logout">
                <LogOut :size="18" /> Logout
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
.main {
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 80px;
}
.headerTitle {
    font-size: 2.5rem;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 60px;
    letter-spacing: 2px;
}
.panelOptions {
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
.iconCircle {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: rgba(247, 177, 118, 0.15);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 14px;
}
.cardTitle {
    font-size: 1rem;
    font-weight: 600;
    color: #ffffff;
}
.logoutButton {
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
.logoutButton:hover {
    background: rgba(255, 107, 107, 0.15);
}
</style>
