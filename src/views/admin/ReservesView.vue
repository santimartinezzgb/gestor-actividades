<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, X } from 'lucide-vue-next';
import { getReserves, cancelReserve } from '@/services/reserve/reserveService';

const router = useRouter();
const reserves = ref<any[]>([]);
const loading = ref(true);

onMounted(() => loadReserves());

const loadReserves = async () => {
    try {
        loading.value = true;
        const data = await getReserves();
        reserves.value = data.filter((r: any) => r.state !== 'CANCELLED' && r.state !== 'CANCELED');
    } catch (e: any) {
        alert(e.message || 'Could not load reserves');
    } finally {
        loading.value = false;
    }
};

const handleCancelReserve = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;
    try {
        await cancelReserve(id);
        alert('Reservation cancelled successfully');
        loadReserves();
    } catch (e: any) {
        alert(e.message || 'Cancellation failed');
    }
};
</script>

<template>
    <main>
        <div class="overlay">
            <div class="header">
                <button class="back-button" @click="router.push('/admin')"><ArrowLeft :size="20" /></button>
                <h2 class="header-title">MANAGE RESERVES</h2>
                <div style="width: 28px"></div>
            </div>

            <div v-if="loading" class="loading">Loading...</div>

            <div v-else class="list-container">
                <p v-if="!reserves.length" class="empty-text">No reserves found</p>
                <div v-for="item in reserves" :key="item.id" class="reserve-card">
                    <div class="card-info">
                        <span class="activity-name">{{ item.activityName }}</span>
                        <span class="username">User: {{ item.username }}</span>
                        <span class="date">
                            {{ new Date(item.activityDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) }}
                        </span>
                    </div>
                    <button class="cancel-button" @click="handleCancelReserve(item.id)">
                        <X :size="16" /> Cancel
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
.overlay {
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
.back-button {
    background: transparent;
    border: none;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 5px;
}
.header-title {
    font-size: 1.3rem;
    font-weight: bold;
    color: #fff;
    letter-spacing: 1px;
}
.loading {
    color: #F7B176;
    font-size: 1.2rem;
    margin-top: 50px;
}
.list-container {
    width: 90%;
    max-width: 800px;
    overflow-y: auto;
    padding-bottom: 20px;
}
.reserve-card {
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
.reserve-card:hover {
    background: rgba(255, 255, 255, 0.12);
}
.card-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
}
.activity-name {
    font-size: 1.1rem;
    font-weight: bold;
    color: #fff;
}
.username {
    font-size: 0.9rem;
    color: #F7B176;
}
.date {
    font-size: 0.8rem;
    color: #aaa;
}
.cancel-button {
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
.cancel-button:hover {
    background: rgba(255, 107, 107, 0.15);
}
.empty-text {
    color: #888;
    text-align: center;
    margin-top: 50px;
    font-size: 1rem;
}
</style>
