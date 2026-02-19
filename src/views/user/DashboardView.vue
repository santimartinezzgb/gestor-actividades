<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { User, Calendar, LogOut, Plus, Ban, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { getReserves, cancelReserve } from '@/services/reserve/reserveService';
import { userSession } from '@/services/auth/session';

const router = useRouter();
const reserves = ref<any[]>([]);
const loadingReserves = ref(true);

// CALENDARIO
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

// Días con reserva
const reserveDays = computed(() => {
    const days = new Set<string>();
    reserves.value.forEach((r: any) => {
        const d = new Date(r.activityDate);
        days.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    });
    return days;
});

const hasReserve = (day: number) => {
    return reserveDays.value.has(`${currentYear.value}-${currentMonth.value}-${day}`);
};

const isToday = (day: number) => {
    const now = new Date();
    return day === now.getDate() && currentMonth.value === now.getMonth() && currentYear.value === now.getFullYear();
};

// Generar días del calendario
const calendarDays = computed(() => {
    const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay();
    const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
    const offset = firstDay === 0 ? 6 : firstDay - 1; // Lunes = 0
    const cells: (number | null)[] = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
});

// CARGAR RESERVAS DEL USUARIO
const loadReserves = async () => {
    try {
        loadingReserves.value = true;
        const data = await getReserves();
        reserves.value = data.filter((r: any) =>
            r.userId === userSession.userId &&
            r.state !== 'CANCELED' &&
            r.state !== 'CANCELLED' &&
            r.activityName &&
            r.activityDate
        );
    } catch (e: any) {
        console.error(e.message);
    } finally {
        loadingReserves.value = false;
    }
};

// CANCELAR RESERVA
const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;
    try {
        await cancelReserve(id);
        await loadReserves();
    } catch (e: any) {
        alert(e.message || 'Error cancelling reservation');
        await loadReserves();
    }
};

onMounted(() => loadReserves());

// CERRAR SESIÓN
const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
};
</script>

<template>
    <main>
        <div class="main">
            <!-- TOP BAR -->
            <div class="topBar">
                <h1 class="headerTitle">MY DASHBOARD</h1>
                <div class="topBarActions">
                    <button class="profileButton" @click="router.push('/user/profile')" title="My Profile">
                        <User :size="22" color="#F7B176" />
                    </button>
                    <button class="logoutButton" @click="logout" title="Logout">
                        <LogOut :size="22" color="#ff6b6b" />
                    </button>
                </div>
            </div>

            <!-- CONTENIDO CENTRAL -->
            <div class="centerContent">
                <div class="dashboardGrid">
                    <!-- LISTA DE RESERVAS -->
                    <div class="reservesPanel">
                        <div class="reservesHeader">
                            <h2 class="reservesTitle">
                                <Calendar :size="22" color="#F7B176" />
                                My Reserves
                            </h2>
                            <button class="addReserveBtn" @click="router.push('/user/activities')" title="Add Reserve">
                                <Plus :size="18" />
                                New
                            </button>
                        </div>

                        <div v-if="loadingReserves" class="reservesLoading">Loading reserves...</div>

                        <div v-else-if="!reserves.length" class="reservesEmpty">
                            <Calendar :size="40" color="rgba(255,255,255,0.15)" />
                            <p>No reserves yet</p>
                            <button class="addFirstBtn" @click="router.push('/user/activities')">
                                <Plus :size="16" /> Browse Activities
                            </button>
                        </div>

                        <div v-else class="reservesList">
                            <div v-for="item in reserves" :key="item.id" class="reserveItem">
                                <div class="reserveInfo">
                                    <span class="reserveActivity">{{ item.activityName }}</span>
                                    <span class="reserveDate">
                                        {{ new Date(item.activityDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) }}
                                    </span>
                                </div>
                                <button class="cancelBtn" @click="handleCancel(item.id)" title="Cancel reserve">
                                    <Ban :size="16" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- CALENDARIO -->
                    <div class="calendarPanel">
                        <div class="calendarHeader">
                            <button class="calNavBtn" @click="prevMonth">
                                <ChevronLeft :size="18" />
                            </button>
                            <span class="calMonthTitle">{{ monthName }}</span>
                            <button class="calNavBtn" @click="nextMonth">
                                <ChevronRight :size="18" />
                            </button>
                        </div>
                        <div class="calendarWeekdays">
                            <span v-for="d in ['Mo','Tu','We','Th','Fr','Sa','Su']" :key="d">{{ d }}</span>
                        </div>
                        <div class="calendarGrid">
                            <div
                                v-for="(day, idx) in calendarDays"
                                :key="idx"
                                class="calDay"
                                :class="{
                                    empty: !day,
                                    today: day && isToday(day),
                                    hasReserve: day && hasReserve(day)
                                }"
                            >
                                <span v-if="day">{{ day }}</span>
                            </div>
                        </div>
                        <div class="calendarLegend">
                            <span class="legendDot reserved"></span> Reserved
                            <span class="legendDot todayDot"></span> Today
                        </div>
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
.main {
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

/* TOP BAR */
.topBar {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28px 36px;
    position: relative;
    box-sizing: border-box;
}
.headerTitle {
    font-size: 2.2rem;
    font-weight: bold;
    color: #ffffff;
    letter-spacing: 2px;
    margin: 0;
}
.topBarActions {
    position: absolute;
    right: 36px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
}
.profileButton {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: rgba(247, 177, 118, 0.12);
    border: 1.5px solid rgba(247, 177, 118, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
}
.profileButton:hover {
    background: rgba(247, 177, 118, 0.25);
    border-color: #F7B176;
    transform: scale(1.08);
}
.logoutButton {
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

/* CONTENIDO CENTRAL */
.centerContent {
    flex: 1;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 30px 36px 40px;
    width: 100%;
    box-sizing: border-box;
    overflow-y: auto;
}
.dashboardGrid {
    display: flex;
    flex-direction: row;
    gap: 28px;
    width: 100%;
    max-width: 900px;
    align-items: flex-start;
}

/* PANEL DE RESERVAS */
.reservesPanel {
    flex: 1;
    min-width: 0;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 24px;
    box-sizing: border-box;
}
.reservesHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}
.reservesTitle {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #ffffff;
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0;
}
.addReserveBtn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 12px;
    background: rgba(247, 177, 118, 0.15);
    border: 1px solid rgba(247, 177, 118, 0.4);
    color: #F7B176;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}
.addReserveBtn:hover {
    background: rgba(247, 177, 118, 0.3);
    border-color: #F7B176;
    transform: scale(1.04);
}
.reservesLoading {
    text-align: center;
    color: rgba(255, 255, 255, 0.4);
    padding: 30px 0;
    font-size: 0.95rem;
}
.reservesEmpty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 30px 0;
}
.reservesEmpty p {
    color: rgba(255, 255, 255, 0.35);
    font-size: 0.95rem;
    margin: 0;
}
.addFirstBtn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    border-radius: 12px;
    background: rgba(247, 177, 118, 0.12);
    border: 1px solid rgba(247, 177, 118, 0.3);
    color: #F7B176;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}
.addFirstBtn:hover {
    background: rgba(247, 177, 118, 0.25);
    border-color: #F7B176;
}
.reservesList {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 320px;
    overflow-y: auto;
}
.reservesList::-webkit-scrollbar {
    width: 4px;
}
.reservesList::-webkit-scrollbar-thumb {
    background: rgba(247, 177, 118, 0.3);
    border-radius: 4px;
}
.reserveItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: all 0.25s ease;
}
.reserveItem:hover {
    background: rgba(255, 255, 255, 0.09);
    border-color: rgba(255, 255, 255, 0.18);
}
.reserveInfo {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.reserveActivity {
    color: #ffffff;
    font-size: 1rem;
    font-weight: 600;
}
.reserveDate {
    color: rgba(255, 255, 255, 0.45);
    font-size: 0.82rem;
}
.cancelBtn {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(255, 107, 107, 0.1);
    border: 1px solid rgba(255, 107, 107, 0.25);
    color: #ff6b6b;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
}
.cancelBtn:hover {
    background: rgba(255, 107, 107, 0.25);
    border-color: #ff6b6b;
    transform: scale(1.1);
}

/* CALENDARIO */
.calendarPanel {
    width: 300px;
    min-width: 300px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 22px;
    box-sizing: border-box;
}
.calendarHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}
.calMonthTitle {
    color: #ffffff;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.5px;
}
.calNavBtn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s ease;
}
.calNavBtn:hover {
    background: rgba(247, 177, 118, 0.2);
    border-color: #F7B176;
}
.calendarWeekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    margin-bottom: 6px;
}
.calendarWeekdays span {
    text-align: center;
    font-size: 0.7rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.35);
    padding: 4px 0;
}
.calendarGrid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 3px;
}
.calDay {
    aspect-ratio: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.6);
    transition: all 0.2s ease;
    position: relative;
}
.calDay.empty {
    pointer-events: none;
}
.calDay.today {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    font-weight: 700;
    border: 1px solid rgba(255, 255, 255, 0.25);
}
.calDay.hasReserve {
    background: rgba(247, 177, 118, 0.2);
    color: #F7B176;
    font-weight: 700;
    border: 1px solid rgba(247, 177, 118, 0.45);
}
.calDay.today.hasReserve {
    background: rgba(247, 177, 118, 0.3);
    color: #F7B176;
    border-color: #F7B176;
    box-shadow: 0 0 8px rgba(247, 177, 118, 0.25);
}
.calendarLegend {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.4);
}
.legendDot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
}
.legendDot.reserved {
    background: rgba(247, 177, 118, 0.5);
    border: 1px solid #F7B176;
}
.legendDot.todayDot {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.35);
}

/* RESPONSIVE */
@media (max-width: 700px) {
    .dashboardGrid {
        flex-direction: column;
    }
    .calendarPanel {
        width: 100%;
        min-width: unset;
    }
}
</style>
