<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // HANDLE NAVIGATION

const router = useRouter();

const showReservations = ref(false);
const showSidebar = ref(false);

const logout = () => {
    router.push('/login');
};

const goToExtra1 = () => router.push('/extra1');
const goToExtra2 = () => router.push('/extra2');
</script>

<template>
    <main :class="{ 'with-reservations': showReservations, 'with-sidebar': showSidebar }">

        <button class="btn-myreserves" @click="showReservations = true">
            View Reserves
        </button>
        <button class="btn-showsidebar" v-if="!showSidebar" @click="showSidebar = true">
            &#9776;
        </button>

        <nav class="sidebar" :class="{ show: showSidebar }">
            <button class="btn-close-sidebar" v-if="showSidebar" @click="showSidebar = false">&times;</button>
            <h2>Dashboard</h2>
            <ul>
                <li @click="goToExtra1">Activities</li>
                <li @click="goToExtra2">Reservations</li>
                <li @click="logout" class="logout">Logout</li>
            </ul>
        </nav>


        <section class="content">
            <div class="userCard">
                <h2>username</h2>
            </div>
            <div class="publicity">
                <h2>50% off for 3 months!</h2>
                <p>Invite a friend via your link to unlock</p>
            </div>
        </section>


        <div class="reservations" :class="{ show: showReservations }">
            <button class="btn-close" @click="showReservations = false">&times;</button>
            <h2>My reserves</h2>
            <div class="reserve" @click="goToExtra2">{{}}</div>
        </div>
    </main>
</template>

<style scoped>
    main {
        display: flex;
        width: 100vw;
        height: 100vh;
        background-color: #333;
        color: white;
        position: relative;
        transition: padding-right 0.4s ease, padding-left 0.4s ease;
        box-sizing: border-box;
        padding-left: 250px;
    }
    main.with-reservations {
        padding-right: 22vw;
    }
    main.with-sidebar {
        padding-left: 250px;
    }
    main:not(.with-sidebar) {
        padding-left: 0;
    }
    .btn-myreserves {
        position: absolute;
        top: 2rem;
        right: 2rem;
        z-index: 10;
        background: transparent;
        color: #F7B176;
        border: none;
        border-radius: 0.5rem;
        padding: 0.7rem 1.5rem;
        font-size: 1.1rem;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transition: all 0.2s;
    }
    .btn-myreserves:hover {
        background: #ffb76b;
        color: #222;
    }
    .sidebar {
        width: 250px;
        background-color: #222;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        border-right: none;
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        z-index: 30;
        transform: translateX(-100%);
        transition: transform 0.4s ease, box-shadow 0.3s;
        box-shadow: 4px 0 16px rgba(0,0,0,0.1);
        pointer-events: none;
        opacity: 0;
    }
    .sidebar.show {
        transform: translateX(0);
        pointer-events: auto;
        opacity: 1;
        box-shadow: 8px 0 24px rgba(0,0,0,0.2);
        border-right: 2px solid #F7B176;
    }
    .btn-showsidebar {
        position: absolute;
        top: 2rem;
        left: 2rem;
        z-index: 40;
        color: #F7B176;
        background: transparent;
        border: none;
        border-radius: 0.5rem;
        padding: 0.5rem;
        font-size: 1.5rem;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transition: all 0.2s;
    }
    .btn-showsidebar:hover {
        background: #ffb76b;
        color: #222
    }
    .btn-close-sidebar {
        position: absolute;
        top: 1.2rem;
        right: 1.2rem;
        background: transparent;
        color: #F7B176;
        border: none;
        font-size: 2rem;
        font-weight: bold;
        cursor: pointer;
        z-index: 50;
        transition: color 0.2s;
    }
    .btn-close-sidebar:hover {
        color: #ffb76b;
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
        display: flex;
        flex-direction: column;
        gap: 2rem;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        background-image: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("../assets/image.svg");
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        transition: width 0.4s ease, margin-left 0.4s ease;
        min-width: 0;
        box-sizing: border-box;
        margin-left: 0;
    }
        @media (max-width: 900px) {
            main.with-reservations {
                padding-right: 0;
            }
            .reservations, .reservations.show {
                width: 100vw;
                min-width: 0;
                max-width: 100vw;
            }
            main {
                padding-left: 0;
            }
            .sidebar, .sidebar.show {
                width: 80vw;
                min-width: 0;
                max-width: 80vw;
            }
            .content {
                margin-left: 0;
            }
        }
    .userCard {
        background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("../assets/userCard.svg");
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        width: 40%;
        height: 30vh;
        padding: 2rem;
        border-radius: 1rem;
        text-align: left;
        cursor: pointer;
    }
    .userCard:hover {
        border: 2px solid #F7B176;
        color: #F7B176;

        padding: 1.9rem;
    }
    .userCard h2 {
        font-size: 2rem;
        margin: 0;
        font-weight: 500;
    }
    .publicity {
        background-image: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("../assets/publicity.svg");
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        width: 40%;
        height: 30vh;
        padding: 2rem;
        border-radius: 1rem;
        text-align: left;
    }





    .reservations {
        display: flex;
        flex-direction: column;
        width: 22vw;
        max-width: 400px;
        min-width: 250px;
        height: 100vh;
        background: #222;
        position: fixed;
        top: 0;
        right: 0;
        z-index: 20;
        box-shadow: -4px 0 16px rgba(0,0,0,0.2);
        gap: 2rem;
        margin: 0;
        padding: 2rem 1.5rem 1.5rem 1.5rem;
        transform: translateX(100%);
        transition: transform 0.4s ease, box-shadow 0.3s;
        pointer-events: none;
        opacity: 0;
    }
    .reservations.show {
        transform: translateX(0);
        box-shadow: -8px 0 24px rgba(0,0,0,0.3);
        pointer-events: auto;
        opacity: 1;
    }
    .btn-close {
        position: absolute;
        top: 1.2rem;
        right: 1.2rem;
        background: transparent;
        color: #F7B176;
        border: none;
        font-size: 2rem;
        font-weight: bold;
        cursor: pointer;
        z-index: 30;
        transition: color 0.2s;
    }
    .btn-close:hover {
        color: #ffb76b;
    }
        @media (max-width: 900px) {
            main.with-reservations {
                padding-right: 0;
            }
            .reservations, .reservations.show {
                width: 100vw;
                min-width: 0;
                max-width: 100vw;
            }
        }
    .reserve {
        background-color: #444;

        padding: 2rem;
        border-radius: 0.5rem;
        text-align: center;
        font-size: 1.5rem;
        cursor: pointer;
        border: 2px solid transparent;
    }
    .reserve:hover {
        border-color: #F7B176;
        background-color: #555;
        color: #F7B176
    }
</style>
