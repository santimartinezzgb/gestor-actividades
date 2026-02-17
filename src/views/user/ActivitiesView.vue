<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getActivities } from '@/services/activity/activityService';
import { createReserve } from '@/services/reserve/reserveService';
import { userSession } from '@/services/auth/session';

const router = useRouter();
const activities = ref<any[]>([]);
const loading = ref(true);
const error = ref('');
const successMsg = ref('');

onMounted(() => loadActivities());

const loadActivities = async () => {
    try {
        loading.value = true;
        activities.value = await getActivities();
    } catch (e: any) {
        error.value = e.message || 'Could not load activities';
    } finally {
        loading.value = false;
    }
};

const handleReserve = async (activityId: string) => {
    if (!userSession.userId) {
        alert('Session not found. Please log in again.');
        router.replace('/login');
        return;
    }
    try {
        await createReserve(userSession.userId, activityId);
        successMsg.value = 'Activity reserved successfully! Check "My Reserves" section.';
        setTimeout(() => successMsg.value = '', 3000);
    } catch (e: any) {
        alert(e.message || 'Reservation failed');
    }
};
</script>

<template>
    <main>
        <div class="overlay">
            <div class="header">
                <button class="back-button" @click="router.push('/user')">←</button>
                <h2 class="header-title">AVAILABLE ACTIVITIES</h2>
                <div style="width: 28px"></div>
            </div>

            <p v-if="successMsg" class="success-msg">{{ successMsg }}</p>

            <div v-if="loading" class="loading">Loading...</div>

            <div v-else class="list-container">
                <p v-if="!activities.length" class="empty-text">No activities available</p>
                <div
                    v-for="item in activities"
                    :key="item.id"
                    class="activity-card"
                    :class="{ 'full-card': item.reservedCount >= item.capacity }"
                >
                    <div class="card-info">
                        <span class="activity-name">{{ item.name }}</span>
                        <span class="activity-details">
                            {{ new Date(item.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) }}
                        </span>
                        <span
                            class="capacity-info"
                            :class="{ 'full-text': item.reservedCount >= item.capacity }"
                        >
                            {{ item.reservedCount >= item.capacity
                                ? 'FULL'
                                : `Available: ${item.capacity - item.reservedCount} / ${item.capacity}`
                            }}
                        </span>
                    </div>
                    <button
                        class="reserve-button"
                        :class="{ 'disabled-button': item.reservedCount >= item.capacity }"
                        :disabled="item.reservedCount >= item.capacity"
                        @click="handleReserve(item.id)"
                    >
                        {{ item.reservedCount >= item.capacity ? '❌ Full' : '📅 Reserve' }}
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
.success-msg {
    color: #4caf50;
    font-weight: bold;
    margin-bottom: 10px;
    background: rgba(76,175,80,0.1);
    padding: 10px 20px;
    border-radius: 8px;
}
.list-container {
    width: 90%;
    max-width: 800px;
    overflow-y: auto;
    padding-bottom: 20px;
}
.activity-card {
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
.activity-card:hover {
    background: rgba(255, 255, 255, 0.12);
}
.full-card {
    border-color: rgba(255, 0, 0, 0.2);
    background: rgba(255, 0, 0, 0.05);
}
.card-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.activity-name {
    font-size: 1.1rem;
    font-weight: bold;
    color: #fff;
}
.activity-details {
    font-size: 0.9rem;
    color: #F7B176;
}
.capacity-info {
    font-size: 0.8rem;
    color: #aaa;
}
.full-text {
    color: #ff6b6b;
    font-weight: bold;
}
.reserve-button {
    background: transparent;
    border: 1px solid rgba(247, 177, 118, 0.3);
    color: #F7B176;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    font-size: 0.85rem;
    transition: all 0.2s;
    white-space: nowrap;
}
.reserve-button:hover:not(:disabled) {
    background: rgba(247, 177, 118, 0.15);
}
.disabled-button {
    opacity: 0.5;
    cursor: not-allowed;
    color: #888;
    border-color: rgba(255,255,255,0.1);
}
.empty-text {
    color: #888;
    text-align: center;
    margin-top: 50px;
    font-size: 1rem;
}
</style>
