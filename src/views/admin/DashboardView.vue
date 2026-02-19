<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import { Users, Dumbbell, Calendar, LogOut, ArrowRight } from 'lucide-vue-next';
import { getActivities } from '@/services/activity/activityService';
import { getReserves } from '@/services/reserve/reserveService';
import { getUsers } from '@/services/user/userService';

const router = useRouter();

const users = ref<any[]>([]);
const activities = ref<any[]>([]);
const reserves = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
    try {
        const [u, a, r] = await Promise.all([getUsers(), getActivities(), getReserves()]);
        users.value = u;
        activities.value = a;
        reserves.value = r;
    } catch (e: any) {
        console.error('Error loading dashboard data:', e.message);
    } finally {
        loading.value = false;
    }
});

const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
};

// CALENDARIO (mitad inferior)
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());

const monthName = computed(() => {
    return new Date(currentYear.value, currentMonth.value).toLocaleString('en', { month: 'long', year: 'numeric' });
});

const prevMonth = () => {
    if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value--;
    } else {
        currentMonth.value--;
    }
};

const nextMonth = () => {
    if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value++;
    } else {
        currentMonth.value++;
    }
};

const activityDays = computed(() => {
    const days = new Set();
    activities.value.forEach((a: any) => {
        if (!a.date) return;
        const d = new Date(a.date);
        days.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    });
    return days;
});

const hasActivity = (day: number) => {
    return activityDays.value.has(`${currentYear.value}-${currentMonth.value}-${day}`);
};

const isToday = (day: number) => {
    const now = new Date();
    return day === now.getDate() && currentMonth.value === now.getMonth() && currentYear.value === now.getFullYear();
};

const calendarDays = computed(() => {
    const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay();
    const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const cells: (number | null)[] = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
});

const confirmedReserves = computed(() => reserves.value.filter((r: any) => r.state === 'CONFIRMED'));
const fmt = (d: string) => new Date(d).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
</script>

<template>
    <main>
        <div class="overlay">
            <div class="topBar">
                <h1 class="header-title">ADMIN PANEL</h1>
                <button class="logoutButton" @click="logout" title="Logout">
                    <LogOut :size="22" color="#ff6b6b" />
                </button>
            </div>

            <div v-if="loading" class="loadingText">Loading dashboard...</div>

            <div v-else class="dashboardLayout">
                <div class="leftColumn">
                    <div class="panelsContainerColumn">

                        <!-- PANEL DE USUARIOS -->
                        <div class="panel">

                            <div class="panelHeader" @click="router.push('/admin/users')">
                                <div class="panelTitleGroup">
                                    <Users :size="20" color="#F7B176" />
                                    <span class="panelTitle">Users</span>
                                    <span class="panelCount">{{ users.length }}</span>
                                </div>
                                <ArrowRight :size="18" color="#F7B176" />
                            </div>
                            <div class="panelBody">
                                <p v-if="!users.length" class="emptyPanel">No users found</p>
                                <div v-for="item in users" :key="item.id" class="panelItem">
                                    <span class="itemMain">{{ item.username }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- PANEL DE ACTIVIDADES -->
                        <div class="panel">
                            <div class="panelHeader" @click="router.push('/admin/activities')">
                                <div class="panelTitleGroup">
                                    <Dumbbell :size="20" color="#F7B176" />
                                    <span class="panelTitle">Activities</span>
                                    <span class="panelCount">{{ activities.length }}</span>
                                </div>
                                <ArrowRight :size="18" color="#F7B176" />
                            </div>
                            <div class="panelBody">
                                <p v-if="!activities.length" class="emptyPanel">No activities found</p>
                                <div v-for="item in activities" :key="item.id" class="panelItem">
                                    <div class="itemCol">
                                        <span class="itemMain">{{ item.name }}</span>
                                        <span class="itemSub">{{ fmt(item.date) }}</span>
                                    </div>
                                    <span class="itemCapacity" :class="{ capacityFull: item.reservedCount >= item.capacity }">
                                        {{ item.reservedCount }}/{{ item.capacity }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- PANEL DE RESERVAS -->
                        <div class="panel">
                            <div class="panelHeader" @click="router.push('/admin/reserves')">
                                <div class="panelTitleGroup">
                                    <Calendar :size="20" color="#F7B176" />
                                    <span class="panelTitle">Reserves</span>
                                    <span class="panelCount">{{ confirmedReserves.length }}</span>
                                </div>
                                <ArrowRight :size="18" color="#F7B176" />
                            </div>
                            <div class="panelBody">
                                <p v-if="!confirmedReserves.length" class="emptyPanel">No reserves found</p>
                                <div v-for="item in confirmedReserves" :key="item.id" class="panelItem">
                                    <div class="itemCol">
                                        <span class="itemMain">{{ item.activityName || 'Unknown' }}</span>
                                        <span class="itemSub">{{ item.username || 'Unknown' }}</span>
                                        <span class="itemSub">{{ item.activityDate ? fmt(item.activityDate) : '—' }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="rightCalendar">
                    <div class="calendarHeader">
                        <button class="calNavBtn" @click="prevMonth">‹</button>
                        <span class="calMonthTitle">{{ monthName }}</span>
                        <button class="calNavBtn" @click="nextMonth">›</button>
                    </div>

                    <div class="calendarWeekdays">
                        <span v-for="d in ['Mo','Tu','We','Th','Fr','Sa','Su']" :key="d">{{ d }}</span>
                    </div>

                    <div class="calendarGrid">
                        <div
                            v-for="(day, idx) in calendarDays"
                            :key="idx"
                            class="calDay"
                            :class="{ empty: !day, today: day && isToday(day), hasActivity: day && hasActivity(day) }"
                        >{{ day || '' }}</div>
                    </div>

                    <div class="calendarLegend">
                        <span class="legendDot activityDot"></span> Activity
                        <span class="legendDot todayDot"></span> Today
                    </div>
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
    background: rgba(0,0,0,0.6);
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
}
.topBar {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28px 36px;
    position: relative;
    box-sizing: border-box;
}
.header-title {
    font-size: 2.2rem;
    font-weight: bold;
    color: #ffffff;
    letter-spacing: 2px;
    margin: 0;
}
.logoutButton {
    position: absolute;
    right: 36px;
    top: 50%;
    transform: translateY(-50%);
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: rgba(255, 107, 107, 0.10);
    border: 1.5px solid rgba(255, 107, 107, 0.35);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
}
.logoutButton:hover {
    background: rgba(255, 107, 107, 0.25);
    border-color: #ff6b6b;
    transform: scale(1.08);
}
.loadingText {
    color: #F7B176;
    font-size: 1.1rem;
    margin-top: 60px;
}

.dashboardLayout {
    display: flex;
    flex-direction: row;
    gap: 20px;
    width: 100%;
    max-width: 1200px;
    padding: 10px 36px 36px;
    box-sizing: border-box;
    flex: 1 1 0;
    min-height: 0;
    overflow: hidden;
    align-items: stretch;
}

.leftColumn {
    width: 38%;
    min-width: 320px;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.panelsContainerColumn {
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 100%;
    flex: 1 1 0;
    min-height: 0;
    overflow: hidden;
}
.panel {
    flex: 1 1 0;
    min-height: 0;
    min-width: 0;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.panelHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    cursor: pointer;
    transition: background 0.2s;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.panelHeader:hover {
    background: rgba(247, 177, 118, 0.08);
}
.panelTitleGroup {
    display: flex;
    align-items: center;
    gap: 10px;
}
.panelTitle {
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
}
.panelCount {
    background: rgba(247, 177, 118, 0.2);
    color: #F7B176;
    font-size: 0.8rem;
    font-weight: 700;
    padding: 2px 10px;
    border-radius: 12px;
}
.panelBody {
    flex: 1 1 0;
    min-height: 0;
    overflow-y: auto;
    padding: 8px 0;
}
.panelBody::-webkit-scrollbar { width: 4px; }
.panelBody::-webkit-scrollbar-thumb { background: rgba(247, 177, 118, 0.3); border-radius: 4px; }
.emptyPanel {
    color: rgba(255,255,255,0.3);
    text-align: center;
    padding: 30px 0;
    font-size: 0.9rem;
    margin: 0;
}
.panelItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    transition: background 0.15s;
}
.panelItem:hover {
    background: rgba(255, 255, 255, 0.04);
}
.itemCol {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}
.itemMain {
    color: #fff;
    font-size: 0.95rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.itemSub {
    color: rgba(255,255,255,0.45);
    font-size: 0.8rem;
}
.itemCapacity {
    color: #F7B176;
    font-size: 0.85rem;
    font-weight: 700;
    white-space: nowrap;
}
.capacityFull {
    color: #ff6b6b;
}
.itemBadge {
    font-size: 0.7rem;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
}
.badgeAdmin {
    background: rgba(247, 177, 118, 0.15);
    color: #F7B176;
}
.badgeUser {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255,255,255,0.5);
}
.badgeConfirmed {
    background: rgba(76, 175, 80, 0.15);
    color: #4caf50;
}
.badgeCanceled {
    background: rgba(255, 107, 107, 0.15);
    color: #ff6b6b;
}
.rightCalendar {
    width: 62%;
    min-width: 420px;
    height: 100%;
    box-sizing: border-box;
    padding: 12px 24px 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    overflow: hidden;
}
.calendarHeader {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 8px;
}
.calNavBtn {
    background: transparent;
    border: none;
    color: #fff;
    font-size: 1.4rem;
    cursor: pointer;
}
.calMonthTitle {
    color: #F7B176;
    font-weight: 700;
}
.calendarWeekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
    color: rgba(255,255,255,0.6);
    font-size: 0.85rem;
    margin-bottom: 6px;
}
.calendarGrid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-auto-rows: 1fr;
    gap: 6px;
    flex: 1 1 0;
    min-height: 0;
}
.calDay {
    background: rgba(255,255,255,0.04);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    color: rgba(255,255,255,0.6);
}
.calDay.empty { background: transparent; }
.calDay.today { border: 1px solid rgba(247,177,118,0.6); }
.calDay.hasActivity { background: rgba(247,177,118,0.12); color: #fff; }
.calendarLegend { margin-top: 8px; color: rgba(255,255,255,0.6); display:flex; gap:12px; align-items:center; }
.legendDot { width:10px; height:10px; border-radius:50%; display:inline-block; }
.activityDot { background: rgba(247,177,118,0.8); }
.todayDot { background: rgba(255,255,255,0.6); }
</style>
