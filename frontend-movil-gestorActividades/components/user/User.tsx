import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { clearSession, userSession } from '../../services/session';
import { getReserves } from '../../services/reserveService';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export const User = () => {
    const router = useRouter();
    const [reserves, setReserves] = useState<any[]>([]);

    // CALENDARIO
    const [calMonth, setCalMonth] = useState(new Date().getMonth());
    const [calYear, setCalYear] = useState(new Date().getFullYear());

    useEffect(() => { loadReserves(); }, []);

    // CARGAR RESERVAS DEL USUARIO (solo para el calendario)
    const loadReserves = async () => {
        try {
            const data = await getReserves();
            setReserves(data.filter((r: any) =>
                r.userId === userSession.userId &&
                r.state !== 'CANCELED' &&
                r.state !== 'CANCELLED' &&
                r.activityName &&
                r.activityDate
            ));
        } catch (error) {
            console.error('Error loading reserves', error);
        }
    };

    // DATOS DEL CALENDARIO
    const monthName = new Date(calYear, calMonth).toLocaleString('en', { month: 'long', year: 'numeric' });

    const reserveDays = useMemo(() => {
        const days = new Set<string>();
        reserves.forEach((r: any) => {
            const d = new Date(r.activityDate);
            days.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
        });
        return days;
    }, [reserves]);

    const calendarCells = useMemo(() => {
        const firstDay = new Date(calYear, calMonth, 1).getDay();
        const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
        const offset = firstDay === 0 ? 6 : firstDay - 1;
        const cells: (number | null)[] = [];
        for (let i = 0; i < offset; i++) cells.push(null);
        for (let d = 1; d <= daysInMonth; d++) cells.push(d);
        return cells;
    }, [calMonth, calYear]);

    const isToday = (day: number) => {
        const now = new Date();
        return day === now.getDate() && calMonth === now.getMonth() && calYear === now.getFullYear();
    };

    const hasReserve = (day: number) => reserveDays.has(`${calYear}-${calMonth}-${day}`);

    const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else { setCalMonth(m => m - 1); } };
    const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else { setCalMonth(m => m + 1); } };

    return (
        <View style={s.container}>
            <View style={s.main}>
                {/* TOP BAR */}
                <View style={s.topBar}>
                    <Text style={s.headerTitle}>MY DASHBOARD</Text>
                    <View style={s.topBarActions}>
                        <TouchableOpacity style={s.profileBtn} onPress={() => router.push('/user/profile')}>
                            <MaterialCommunityIcons name="account" size={20} color="#F7B176" />
                        </TouchableOpacity>
                        <TouchableOpacity style={s.logoutBtn} onPress={() => { clearSession(); router.replace('/login'); }}>
                            <MaterialCommunityIcons name="logout" size={20} color="#ff6b6b" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
                    {/* TARJETAS DE NAVEGACIÓN */}
                    <View style={s.navCards}>
                        <TouchableOpacity style={s.navCard} onPress={() => router.push('/user/reserves')} activeOpacity={0.8}>
                            <View style={s.navCardIcon}>
                                <MaterialCommunityIcons name="book-clock" size={24} color="#F7B176" />
                            </View>
                            <View style={s.navCardInfo}>
                                <Text style={s.navCardTitle}>My Reserves</Text>
                                <Text style={s.navCardSub}>See and cancel bookings</Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={22} color="#F7B176" />
                        </TouchableOpacity>

                        <TouchableOpacity style={s.navCard} onPress={() => router.push('/user/activities')} activeOpacity={0.8}>
                            <View style={s.navCardIcon}>
                                <MaterialCommunityIcons name="calendar-search" size={24} color="#F7B176" />
                            </View>
                            <View style={s.navCardInfo}>
                                <Text style={s.navCardTitle}>Activities</Text>
                                <Text style={s.navCardSub}>Browse and reserve classes</Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={22} color="#F7B176" />
                        </TouchableOpacity>
                    </View>

                    {/* CALENDARIO */}
                    <View style={s.calPanel}>
                        <View style={s.calHeader}>
                            <TouchableOpacity onPress={prevMonth} style={s.calNavBtn}>
                                <MaterialCommunityIcons name="chevron-left" size={20} color="#fff" />
                            </TouchableOpacity>
                            <Text style={s.calMonthTitle}>{monthName}</Text>
                            <TouchableOpacity onPress={nextMonth} style={s.calNavBtn}>
                                <MaterialCommunityIcons name="chevron-right" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <View style={s.calWeekdays}>
                            {WEEKDAYS.map(d => <Text key={d} style={s.calWeekday}>{d}</Text>)}
                        </View>

                        <View style={s.calGrid}>
                            {calendarCells.map((day, idx) => (
                                <View
                                    key={idx}
                                    style={[
                                        s.calDay,
                                        !day && s.calDayEmpty,
                                        day !== null && isToday(day) && s.calDayToday,
                                        day !== null && hasReserve(day) && s.calDayReserved,
                                        day !== null && isToday(day) && hasReserve(day) && s.calDayTodayReserved,
                                    ]}
                                >
                                    {day !== null && <Text style={[
                                        s.calDayText,
                                        isToday(day) && s.calDayTextToday,
                                        hasReserve(day) && s.calDayTextReserved,
                                    ]}>{day}</Text>}
                                </View>
                            ))}
                        </View>

                        <View style={s.calLegend}>
                            <View style={[s.legendDot, { backgroundColor: 'rgba(247,177,118,0.5)', borderColor: '#F7B176' }]} />
                            <Text style={s.legendLabel}>Reserved</Text>
                            <View style={[s.legendDot, { backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.35)' }]} />
                            <Text style={s.legendLabel}>Today</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    main: {
        flex: 1,
        gap: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 30,
        alignItems: 'center',
    },

    // TOP BAR
    topBar: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingTop: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 2,
    },
    topBarActions: {
        flexDirection: 'row',
        gap: 8,
    },
    profileBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(247,177,118,0.12)',
        borderWidth: 1.5,
        borderColor: 'rgba(247,177,118,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(255,107,107,0.1)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,107,107,0.35)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // TARJETAS DE NAVEGACIÓN
    navCards: {
        width: '100%',
        gap: 10,
        marginBottom: 14,
    },
    navCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 14,
    },
    navCardIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(247,177,118,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    navCardInfo: {
        flex: 1,
    },
    navCardTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    navCardSub: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        marginTop: 2,
    },

    // CALENDARIO
    calPanel: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
    },
    calHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        marginBottom: 12,
    },
    calMonthTitle: {
        color: '#F7B176',
        fontWeight: '700',
        fontSize: 15,
    },
    calNavBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    calWeekdays: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    calWeekday: {
        flex: 1,
        textAlign: 'center',
        fontSize: 11,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.35)',
    },
    calGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    calDay: {
        width: '14.28%',
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        height: 65,
    },
    calDayEmpty: {},
    calDayToday: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    calDayReserved: {
        backgroundColor: 'rgba(247,177,118,0.2)',
        borderWidth: 1,
        borderColor: 'rgba(247,177,118,0.45)',
    },
    calDayTodayReserved: {
        backgroundColor: 'rgba(247,177,118,0.3)',
        borderColor: '#F7B176',
    },
    calDayText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
    },
    calDayTextToday: {
        color: '#fff',
        fontWeight: '700',
    },
    calDayTextReserved: {
        color: '#F7B176',
        fontWeight: '700',
    },
    calLegend: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.06)',
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 1,
    },
    legendLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 11,
        marginRight: 6,
    },
});
