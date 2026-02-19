<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft } from 'lucide-vue-next';
import { getReserves, cancelReserve } from '@/services/reserve/reserveService';
import { userSession } from '@/services/auth/session';

const router = useRouter();
const reserves = ref<any[]>([]); // ALMACENA LAS RESERVAS DEL USUARIO
const loading = ref(true); // ESTADO DE CARGA

// CARGAR RESERVAS AL MONTAR EL COMPONENTE
onMounted(() => loadReserves());

// CARGAR RESERVAS DEL USUSARIO
const loadReserves = async () => {
    try {
        loading.value = true;
        const data = await getReserves();
        
        // FILTRO PARA RESERVAS DEL USUARIO ACTUAL NO CANCELADAS
        reserves.value = data.filter((r: any) =>
            r.userId === userSession.userId &&
            r.state !== 'CANCELED' &&
            r.state !== 'CANCELLED'
        );
    } catch (e: any) {
        alert(e.message);
    } finally {
        // DESACTIVAR ESTADO DE CARGA
        loading.value = false;
    }
};

// MANEJAR CANCELACIÓN DE RESERVA
const handleCancel = async (id: string) => {
    
    // CONFIRMAR CANCELACIÓN
    if (!confirm('Are you sure you want to cancel this reservation?')) return;
    
    try {
        await cancelReserve(id);
        alert('Reservation cancelled successfully');
        loadReserves(); // RECARGAR RESERVAS DESPUÉS DE CANCELAR
    } catch (e: any) {
        alert(e.message);
    }
};
</script>

<template>
    <main>
        <div class="main">
            <div class="header">
                <button class="backButton" @click="router.push('/user')"><ArrowLeft :size="20" /></button>
                <h2 class="headerTitle">MY RESERVES</h2>
                <div style="width: 28px"></div> <!-- ESPACIO PARA ALINEAR TÍTULO -->
            </div>

            <!-- MENSAJE DE CARGA -->
            <div v-if="loading" class="loading">Loading...</div>

            <div v-else class="listContainer">
                <p v-if="!reserves.length" class="emptyText">You don't have any reserves yet</p>

                <!-- LISTADO DE RESERVAS -->
                <div v-for="item in reserves" :key="item.id" class="reserveCard">
                    
                    <!-- INFORMACIÓN DE LA RESERVA -->
                    <div class="cardInfo">
                        <!-- NOMBRE DE LA ACTIVIDAD -->
                        <span class="activityName">{{ item.activityName }}</span>
                        <!-- FECHA DE LA ACTIVIDAD -->
                        <span class="activityDetails">
                            {{ new Date(item.activityDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) }}
                        </span>
                    </div>
                    <!-- BOTÓN DE CANCELAR RESERVA -->
                    <button class="cancelButton" @click="handleCancel(item.id)">
                        Cancel
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
    background-color: #121212;
}
.main {
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
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
.listContainer {
    width: 90%;
    max-width: 800px;
    overflow-y: auto;
    padding-bottom: 20px;
}
.reserveCard {
    width: 100%;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    display: flex;
    align-items: center;
    padding: 15px 20px;
    margin-bottom: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.2s;
}
.reserveCard:hover {
    background: rgba(255, 255, 255, 0.12);
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
.cancelButton {
    background: transparent;
    border: 1px solid rgba(255, 107, 107, 0.3);
    color: #ff6b6b;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    font-size: 0.85rem;
    transition: all 0.2s;
    white-space: nowrap;
}
.cancelButton:hover {
    background: rgba(255, 107, 107, 0.15);
}
.emptyText {
    color: #888;
    text-align: center;
    margin-top: 50px;
    font-size: 1rem;
}
</style>
