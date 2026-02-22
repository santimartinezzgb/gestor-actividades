<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { User, Calendar, LogOut, Dumbbell, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { clearSession } from '@/services/auth/session';
import { getReserves } from '@/services/reserve/reserveService';
import { userSession } from '@/services/auth/session';

const router = useRouter();
const reserves = ref<any[]>([]);
const loadingReserves = ref(true);

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

onMounted(() => loadReserves());

const logout = () => {
    clearSession();
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

            <div class="centerContent">
                <div class="content">

                    <!-- PANELES EN ROW -->
                    <div class="panelsRow">
                        <div class="panel" @click="router.push('/user/reserves')">
                            <h2 class="panelTitle">
                                <Calendar :size="22" color="#F7B176" />
                                My Reserves
                            </h2>
                        </div>

                        <div class="panel" @click="router.push('/user/activities')">
                            <h2 class="panelTitle">
                                <Dumbbell :size="22" color="#F7B176" />
                                Activities
                            </h2>
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
    padding: 2rem;
    background: #00000099;
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
    padding: 30px 35px;
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
    right: 40px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 10px;
}
.profileButton {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: #F7B1761F;
    border: 1.5px solid #F7B17666;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
}
.profileButton:hover {
    background: #F7B17640;
    border-color: #F7B176;
    transform: scale(1.08);
}
.logoutButton {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: #FF6B6B1A;
    border: 1.5px solid #FF6B6B59;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
}
.logoutButton:hover {
    background: #FF6B6B40;
    border-color: #ff6b6b;
    transform: scale(1.08);
}


/* CONTENIDO CENTRAL */
.centerContent {
    flex: 1;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 30px 35px 40px;
    width: 100%;
    box-sizing: border-box;
    overflow-y: auto;
}
.content {
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 100%;
    max-width: 900px;
    align-items: stretch;
}

/* PANELES */
.panelsRow {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: space-around;
}
.panel {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    background-color: #FFFFFF1A;
    padding: 20px 25px;
    border-radius: 12px;
    border: 1px solid #FFFFFF1A;
    transition: all 0.2s ease;
}
.panel:hover {
    background-color: #FFFFFF26;
    border-color: #FFFFFF33;
}
.panelTitle  {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #ffffff;
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0;
}

/* CALENDARIO */
.calendarPanel {
    width: 100%;
    background: #FFFFFF0F;
    border: 1px solid #FFFFFF1A;
    border-radius: 20px;
    padding: 20px;
    box-sizing: border-box;
}
.calendarHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 2rem;
    padding-right: 2rem;
    margin-bottom: 20px;
}
.calMonthTitle {
    color: #ffffff;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.5px;
}
.calNavBtn {
    width: 30px;
    height: 30px;
    border-radius: 12px;
    background: #FFFFFF14;
    border: 1px solid #FFFFFF1F;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s ease;
}
.calNavBtn:hover {
    background: #F7B17633;
    border-color: #F7B176;
}
.calendarWeekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    margin-bottom: 5px;
}
.calendarWeekdays span {
    text-align: center;
    font-size: 0.7rem;
    font-weight: 600;
    color: #FFFFFF59;
    padding: 5px 0;
}
.calendarGrid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 3px;
}
.calDay {
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    font-size: 0.8rem;
    color: #FFFFFF99;
    transition: all 0.2s ease;
}
.calDay.empty {
    pointer-events: none;
}
.calDay.today {
    background: #FFFFFF1A;
    color: #ffffff;
    font-weight: 700;
    border: 1px solid #FFFFFF40;
}
.calDay.hasReserve {
    background: #F7B17633;
    color: #F7B176;
    font-weight: 700;
    border: 1px solid #F7B17673;
}
.calDay.today.hasReserve {
    background: #F7B1764C;
    color: #F7B176;
    border-color: #F7B176;
    box-shadow: 0 0 8px #F7B17640;
}
.calendarLegend {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 15px;
    padding-top: 12px;
    border-top: 1px solid #FFFFFF0F;
    font-size: 0.75rem;
    color: #FFFFFF66;
}
.legendDot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
}
.legendDot.reserved {
    background: #F7B17680;
    border: 1px solid #F7B176;
}
.legendDot.todayDot {
    background: #FFFFFF26;
    border: 1px solid #FFFFFF59;
}
</style>
