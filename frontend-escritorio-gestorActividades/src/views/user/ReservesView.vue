<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, Plus } from 'lucide-vue-next';
import { getReserves, cancelReserve } from '@/services/reserve/reserveService';
import { userSession } from '@/services/auth/session';

const router = useRouter();
const reserves = ref<any[]>([]);
const loading = ref(true);
const search = ref('');

const filteredReserves = computed(() =>
    reserves.value.filter(r =>
        r.activityName.toLowerCase().includes(search.value.toLowerCase())
    )
);

onMounted(() => loadReserves());

const loadReserves = async () => {
    try {
        loading.value = true;
        const data = await getReserves();
        
        reserves.value = data.filter((r: any) =>
            r.userId === userSession.userId &&
            r.state !== 'CANCELED' &&
            r.state !== 'CANCELLED' &&
            r.activityName &&
            r.activityDate
        );
    } catch (e: any) {
        alert(e.message);
    } finally {
        loading.value = false;
    }
};

const handleCancel = async (id: string) => {
    if (!confirm('Cancel this reservation?')) return;
    
    try {
        await cancelReserve(id);
        await loadReserves();
    } catch (e: any) {
        alert(e.message || 'Error cancelling reservation');
        await loadReserves();
    }
};
</script>

<template>
    <main>
        <div class="main">
            <div class="header">
                <button class="backButton" @click="router.push('/user')"><ArrowLeft :size="20" /></button>
                <h2 class="headerTitle">MY RESERVES</h2>
                <button class="newButton" @click="router.push('/user/activities')" title="New Reserve">
                    <Plus :size="18" /> New
                </button>
            </div>

            <div class="statsBar">
                <h2 :class="['userLength', { zero: filteredReserves.length === 0 }]">{{ filteredReserves.length }} reserve{{ filteredReserves.length !== 1 ? 's' : '' }}</h2>
                <input
                    v-model="search"
                    class="searchInput"
                    type="text"
                    placeholder="Search by activity..."
                />
            </div>

            <div v-if="loading" class="loading">Loading...</div>

            <div v-else class="listContainer">
                <p v-if="!filteredReserves.length" class="emptyText">You don't have any reserves yet</p>

                <div v-for="item in filteredReserves" :key="item.id" class="reserveCard">
                    <div class="cardInfo">
                        <span class="activityName">{{ item.activityName }}</span>
                        <span class="activityDetails">
                            {{ new Date(item.activityDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) }}
                        </span>
                    </div>
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
.newButton {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 12px;
    background: #F7B17626;
    border: 1px solid #F7B17666;
    color: #F7B176;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}
.newButton:hover {
    background: #F7B1764D;
    border-color: #F7B176;
    transform: scale(1.04);
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
.listContainer {
    width: 90%;
    max-width: 800px;
    overflow-y: auto;
    padding-bottom: 20px;
}
.reserveCard {
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
.reserveCard:hover {
    background: #FFFFFF1F;
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
    border: 1px solid #FF6B6B4C;
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
    background: #FF6B6B26;
}
.emptyText {
    color: #888;
    text-align: center;
    margin-top: 50px;
    font-size: 1rem;
}
</style>
