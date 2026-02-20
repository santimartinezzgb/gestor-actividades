<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft } from 'lucide-vue-next';
import { getActivities } from '@/services/activity/activityService';
import { createReserve, getReserves } from '@/services/reserve/reserveService';
import { userSession } from '@/services/auth/session';

const router = useRouter();
const activities = ref<any[]>([]);
const reservedActivityIds = ref<Set<string>>(new Set());
const loading = ref(true);
const error = ref('');
const successMsg = ref('');

// CARGAR DATOS
onMounted(() => loadData());

// CARGAR ACTIVIDADES Y RESERVAS DEL USUARIO
const loadData = async () => {
    try {
        loading.value = true;
        const [acts, allReserves] = await Promise.all([getActivities(), getReserves()]);
        activities.value = acts;

        // FILTRAR RESERVAS CONFIRMADAS DEL USUARIO ACTUAL
        reservedActivityIds.value = new Set(
            allReserves
                .filter((r: any) => r.userId === userSession.userId && r.state === 'CONFIRMED')
                .map((r: any) => r.activityId)
        );
    } catch (e: any) {
        error.value = e.message || 'Could not load activities';
    } finally {
        loading.value = false;
    }
};

// COMPROBAR SI EL USUARIO YA RESERVÓ ESTA ACTIVIDAD
const isAlreadyReserved = (activityId: string) => reservedActivityIds.value.has(activityId);

// COMPROBAR SI EL BOTÓN DEBE ESTAR DESHABILITADO
const isButtonDisabled = (item: any) => item.reservedCount >= item.capacity || isAlreadyReserved(item.id);

// TEXTO DEL BOTÓN
const buttonText = (item: any) => {
    if (item.reservedCount >= item.capacity) return 'Full';
    if (isAlreadyReserved(item.id)) return 'Reserved';
    return 'Reserve';
};

// MANEJAR RESERVA
const handleReserve = async (activityId: string) => {
   
    // VERIFICAR SESIÓN DEL USUARIO ( SI NO HAY ID DE USUARIO, REDIRIGIR A LOGIN )
    if (!userSession.userId) {
        alert('Session not found. Please log in again.');
        router.replace('/login');
        return;
    }

    try { // CREAR RESERVA
        await createReserve(userSession.userId, activityId);
        successMsg.value = 'Activity reserved successfully! Check "My Reserves" section.';
        setTimeout(() => successMsg.value = '', 3000);
        await loadData(); // RECARGAR PARA ACTUALIZAR ESTADO DE BOTONES
    } catch (e: any) {
        alert(e.message || 'Reservation failed');
    }
};
</script>

<template>
    <main>
        <div class="main">
            <div class="header">
                <button class="backButton" @click="router.push('/user')"><ArrowLeft :size="20" /></button>
                <h2 class="headerTitle">AVAILABLE ACTIVITIES</h2>
                <div style="width: 28px"></div>
            </div>

            <p v-if="successMsg" class="successMsg">{{ successMsg }}</p>

            <div v-if="loading" class="loading">Loading...</div>

            <div v-else class="listContainer">
                <p v-if="!activities.length" class="emptyText">No activities available</p>
                <div
                    v-for="item in activities"
                    :key="item.id"
                    class="activityCard"
                    :class="{ 'fullCard': item.reservedCount >= item.capacity }"
                >
                    <div class="cardInfo">
                        <span class="activityName">{{ item.name }}</span>
                        <span class="activityDetails">
                            {{ new Date(item.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) }}
                        </span>
                        <span
                            class="capacityInfo"
                            :class="{ 'fullText': item.reservedCount >= item.capacity }"
                        >
                            {{ item.reservedCount >= item.capacity
                                ? 'FULL'
                                : `Available: ${item.capacity - item.reservedCount} / ${item.capacity}`
                            }}
                        </span>
                    </div>

                    <!-- BOTÓN DE RESERVA ( LLENA O YA RESERVADA == DESHABILITADO ) -->
                    <button class="reserveButton"
                        :class="{
                            'disabledButton': isButtonDisabled(item),
                            'reservedButton': isAlreadyReserved(item.id)
                        }"
                        :disabled="isButtonDisabled(item)"
                        @click="handleReserve(item.id)"
                    >
                        {{ buttonText(item) }}
                    </button>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
main {
    width: 100vw;
    height: 100vh;
    background-color: transparent;
}
.main {
    width: 100%;
    height: 100%;
    background: #000000B2;
    padding-top: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 90%;
    max-width: 800px;
    margin-bottom: 20px;
}
.backButton {
    background: transparent;
    border: none;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 5px;
}
.headerTitle {
    font-size: 1.2rem;
    font-weight: bold;
    color: #fff;
    letter-spacing: 1px;
}
.loading {
    color: #F7B176;
    font-size: 1.2rem;
    margin-top: 50px;
}
.successMsg {
    color: #4caf50;
    font-weight: bold;
    margin-bottom: 10px;
    background: #4CAF501A;
    padding: 10px 20px;
    border-radius: 8px;
}
.listContainer {
    width: 90%;
    max-width: 800px;
    overflow-y: auto;
    padding-bottom: 20px;
}
.activityCard {
    width: 100%;
    background: #FFFFFF14;
    border-radius: 12px;
    display: flex;
    align-items: center;
    padding: 15px 20px;
    margin-bottom: 12px;
    border: 1px solid #FFFFFF1A;
    transition: all 0.2s;
}
.activityCard:hover {
    background: #FFFFFF1F;
}
.fullCard {
    border-color: #FF505066;
    background: #FF28281F;
}
.fullCard:hover {
    background: #FF28282E;
}
.cardInfo {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.activityName {
    font-size: 1.1rem;
    font-weight: bold;
    color: #fff;
}
.activityDetails {
    font-size: 0.9rem;
    color: #F7B176;
}
.capacityInfo {
    font-size: 0.8rem;
    color: #aaa;
}
.fullText {
    color: #ff6b6b;
    font-weight: bold;
}
.reserveButton {
    background: transparent;
    border: 1px solid #F7B1764C;
    color: #F7B176;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    font-size: 0.85rem;
    transition: all 0.2s;
    white-space: nowrap;
}
.reserveButton:hover:not(:disabled) {
    background: #F7B17626;
}
.disabledButton {
    opacity: 0.5;
    cursor: not-allowed;
    color: #888;
    border-color: #FFFFFF1A;
}
.reservedButton {
    opacity: 0.7;
    cursor: not-allowed;
    color: #4caf50;
    border-color: #4CAF504C;
    background: #4CAF5014;
}
.emptyText {
    color: #888;
    text-align: center;
    margin-top: 50px;
    font-size: 1rem;
}
</style>
