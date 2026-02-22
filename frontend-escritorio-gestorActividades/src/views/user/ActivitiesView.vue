<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft } from 'lucide-vue-next';
import { getActivities } from '@/services/activity/activityService';
import { createReserve, getReserves } from '@/services/reserve/reserveService';
import { userSession } from '@/services/auth/session';

const router = useRouter();
const activities = ref<any[]>([]);
const reservedActivityIds = ref<Set<string>>(new Set());
const loading = ref(true);
const search = ref('');

const filteredActivities = computed(() =>
    activities.value.filter(a =>
        a.name.toLowerCase().includes(search.value.toLowerCase())
    )
);

onMounted(() => loadData());

const loadData = async () => {
    try {
        loading.value = true;
        const [acts, allReserves] = await Promise.all([getActivities(), getReserves()]);
        activities.value = acts;

        reservedActivityIds.value = new Set(
            allReserves
                .filter((r: any) => r.userId === userSession.userId && r.state === 'CONFIRMED')
                .map((r: any) => r.activityId)
        );
    } catch (e: any) {
        alert(e.message || 'Could not load activities');
    } finally {
        loading.value = false;
    }
};

const isAlreadyReserved = (activityId: string) => reservedActivityIds.value.has(activityId);
const isButtonDisabled = (item: any) => item.reservedCount >= item.capacity || isAlreadyReserved(item.id);

const buttonText = (item: any) => {
    if (isAlreadyReserved(item.id)) return 'Reserved';
    return 'Reserve';
};

const handleReserve = async (activityId: string) => {
   
    if (!userSession.userId) {
        alert('Session not found. Please log in again.');
        router.replace('/login');
        return;
    }

    try {
        await createReserve(userSession.userId, activityId);
        await loadData();
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

            <div class="statsBar">
                <h2 :class="['userLength', { zero: filteredActivities.length === 0 }]">{{ filteredActivities.length }} activit{{ filteredActivities.length !== 1 ? 'ies' : 'y' }}</h2>
                <input
                    v-model="search"
                    class="searchInput"
                    type="text"
                    placeholder="Search by name..."
                />
            </div>

            <div v-if="loading" class="loading">Loading...</div>

            <div v-else class="listContainer">
                <p v-if="!filteredActivities.length" class="emptyText">No activities available</p>
                <div
                    v-for="item in filteredActivities"
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
    padding: 2rem;
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
.statsBar {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 90%;
    max-width: 800px;
    margin: 0 0 2rem 0;
}
.userLength {
    color: #fff;
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
    background-color: #FFFFFF14;
    padding: 10px 20px;
    border-radius: 8px;
    border: 1px solid #FFFFFF1A;
    white-space: nowrap;
    margin: 0;
}
.userLength.zero {
    color: #ff6b6b;
    border-color: #FF6B6B4C;
    background-color: #FF6B6B14;
}
.searchInput {
    flex: 1;
    background: #FFFFFF14;
    border: 1px solid #FFFFFF1A;
    border-radius: 8px;
    padding: 10px 16px;
    color: #fff;
    font-size: 1rem;
    outline: none;
    transition: border 0.2s;
}
.searchInput::placeholder {
    color: #888;
}
.searchInput:focus {
    border-color: #F7B176;
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
