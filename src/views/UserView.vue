<script setup>
import { h, ref } from 'vue';
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

        <!-- Overlay para sidebar -->
        <div v-if="showSidebar" class="overlay overlay-sidebar" @click="showSidebar = false"></div>
        <nav class="sidebar" :class="{ show: showSidebar }">
            <button class="btn-close-sidebar" v-if="showSidebar" @click="showSidebar = false">&times;</button>
            <h2>Dashboard</h2>
            <ul>
                <li @click="goToExtra1">Activities</li>
                <li @click="goToExtra2">Reservations</li>
                <li @click="logout" class="logout">Logout</li>
            </ul>
        </nav>

        <!-- Overlay para reservas -->
        <div v-if="showReservations" class="overlay overlay-reserves" @click="showReservations = false"></div>
        <section class="content">
            <div class="userCard">
                <h2>username</h2>
            </div>
            <button class="newActivity">
                <h2>¡ NEW ACTIVITY !</h2>
                <p> BODY PUMP already unable this week</p>
                <strong>Reserve once you can!</strong>
            </button>
            <div class="publicity">

                <button class="shop">
                    <h2>SHOP</h2>
                    <p>Get your exclusive gears</p>
                </button>

                <button class="invite">
                    <h2>50% off for 3 months!</h2>
                    <p>Invite a friend via this link</p>
                </button>
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
        box-sizing: border-box;
        overflow: hidden;
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
        min-width: 0;
        box-sizing: border-box;
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
        z-index: 110;
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
        z-index: 130;
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



    /* USER CARD */
    .userCard {
        background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("../assets/userCard.svg");
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        width: 40%;
        height: 20vh;
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

    .newActivity {
        background: linear-gradient(270deg, #F7B176, #ff6b6b, #6bf5ff, #F7B176);
        background-size: 400% 400%;
        animation: newActivityGlow 8s ease infinite;
        
        /* Layout */
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 2rem;
        width: 40%;
        height: 30vh;
        padding: 2rem;
        border-radius: 1rem;
        cursor: pointer;
        box-shadow: 0 10px 40px rgba(247, 177, 118, 0.4);
        transition: all 0.3s ease;
        border: 2px solid transparent;
    }

    .newActivity:hover {
        transform: translateY(-3px);
    }

    @keyframes newActivityGlow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    .newActivity h2 {
        font-size: 2rem;
        margin: 0;
        font-weight: bold;
        color: white;
        font-style: italic;
    }
    .newActivity p {
        font-size: 2rem;
        margin: 0;
        font-weight: 500;
        color: white;
    }
    .newActivity strong {
        font-size: 1.5rem;
        color: white;
        background: rgba(255,255,255,0.18);
        border-radius: 2rem;
        opacity: 1;
        backdrop-filter: blur(6px);
        padding: 0.4rem 1.2rem;
        border: 1px solid transparent;
        text-align: center;
    }



    /* PUBLICITY */
    .publicity {
        display: flex;
        justify-content: space-between;
        width: 40%;
        height: 15vh;
        border-radius: 1rem;
    }
    .shop {
        background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("../assets/shop.svg");
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        border-radius: 1rem;
        border: transparent;
        text-align: center;
        color: white;
        width: 45%;
        height: 100%;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    .invite {
        background-image: linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9)), url("../assets/discount.svg");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        border-radius: 1rem;
        border: transparent;
        text-align: center;
        color: white;
        width: 45%;
        height: 100%;
        cursor: pointer;
        transition: all 0.3s ease;

    }
    .invite h2, .shop h2 {
        font-size: 1.5rem;
        margin: 0;
        font-weight: bold;
    }
    .invite p, .shop p {
        font-size: 1.2rem;
        margin: 0;
        font-weight: 500;
    }
    .shop:hover, .invite:hover {
        color: #F7B176;
        transform: translateY(-3px);
    }


    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.6);
        z-index: 100;
        transition: opacity 0.3s;
        pointer-events: auto;
    }
    .overlay-sidebar {
        z-index: 101;
    }
    .sidebar {
        z-index: 110;
    }
    .overlay-reserves {
        z-index: 120;
    }
    .reservations {
        z-index: 130;
    }
</style>
