import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { clearSession } from '../../services/session';
import { getActivities } from '../../services/activityService';
import { getReserves } from '../../services/reserveService';
import { getUsers } from '../../services/userService';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export const AdminDashboard = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [reserves, setReserves] = useState<any[]>([]);

    const [calMonth, setCalMonth] = useState(new Date().getMonth());
    const [calYear, setCalYear] = useState(new Date().getFullYear());

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [u, a, r] = await Promise.all([getUsers(), getActivities(), getReserves()]);
            setUsers(u || []);
            setActivities(a || []);
            setReserves(r || []);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const confirmedReserves = useMemo(() => reserves.filter((r: any) => r.state === 'CONFIRMED'), [reserves]);
    const fmt = (d: string) => new Date(d).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });

    const monthName = new Date(calYear, calMonth).toLocaleString('en', { month: 'long', year: 'numeric' });

    const activityDays = useMemo(() => {
        const days = new Set<string>();
        activities.forEach((a: any) => {
            if (!a.date) return;
            const d = new Date(a.date);
            days.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
        });
        return days;
    }, [activities]);

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

    const hasActivity = (day: number) => activityDays.has(`${calYear}-${calMonth}-${day}`);

    const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else { setCalMonth(m => m - 1); } };
    const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else { setCalMonth(m => m + 1); } };

    return (
        <View style={s.container}>
            <View style={s.main}>
                <View style={s.topBar}>
                    <Text style={s.headerTitle}>ADMIN PANEL</Text>
                    <TouchableOpacity style={s.logoutBtn} onPress={() => { clearSession(); router.replace('/login'); }}>
                        <MaterialCommunityIcons name="logout" size={20} color="#ff6b6b" />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#F7B176" style={{ marginTop: 50 }} />
                ) : (
                    <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

                        <TouchableOpacity style={s.panel} onPress={() => router.push('/admin/users')} activeOpacity={0.8}>
                            <View style={s.panelHeader}>
                                <View style={s.panelTitleGroup}>
                                    <MaterialCommunityIcons name="account-group" size={20} color="#F7B176" />
                                    <Text style={s.panelTitle}>Users</Text>
                                    <View style={s.badge}><Text style={s.badgeText}>{users.length}</Text></View>
                                </View>
                                <MaterialCommunityIcons name="arrow-right" size={18} color="#F7B176" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={s.panel} onPress={() => router.push('/admin/activities')} activeOpacity={0.8}>
                            <View style={s.panelHeader}>
                                <View style={s.panelTitleGroup}>
                                    <MaterialCommunityIcons name="calendar-check" size={20} color="#F7B176" />
                                    <Text style={s.panelTitle}>Activities</Text>
                                    <View style={s.badge}><Text style={s.badgeText}>{activities.length}</Text></View>
                                </View>
                                <MaterialCommunityIcons name="arrow-right" size={18} color="#F7B176" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={s.panel} onPress={() => router.push('/admin/reserves')} activeOpacity={0.8}>
                            <View style={s.panelHeader}>
                                <View style={s.panelTitleGroup}>
                                    <MaterialCommunityIcons name="book-clock" size={20} color="#F7B176" />
                                    <Text style={s.panelTitle}>Reserves</Text>
                                    <View style={s.badge}><Text style={s.badgeText}>{confirmedReserves.length}</Text></View>
                                </View>
                                <MaterialCommunityIcons name="arrow-right" size={18} color="#F7B176" />
                            </View>
                        </TouchableOpacity>

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
                                            day !== null && hasActivity(day) && s.calDayActivity,
                                            day !== null && isToday(day) && hasActivity(day) && s.calDayTodayActivity,
                                        ]}
                                    >
                                        {day !== null && <Text style={[
                                            s.calDayText,
                                            isToday(day) && s.calDayTextToday,
                                            hasActivity(day) && s.calDayTextActivity,
                                        ]}>{day}</Text>}
                                    </View>
                                ))}
                            </View>

                            <View style={s.calLegend}>
                                <View style={[s.legendDot, { backgroundColor: 'rgba(247,177,118,0.5)', borderColor: '#F7B176' }]} />
                                <Text style={s.legendLabel}>Activity</Text>
                                <View style={[s.legendDot, { backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.35)' }]} />
                                <Text style={s.legendLabel}>Today</Text>
                            </View>
                        </View>
                    </ScrollView>
                )}
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
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 40,
        gap: 20,
        alignItems: 'center',
    },

    // TOP BAR
    topBar: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 2,
    },
    logoutBtn: {
        position: 'absolute',
        right: 0,
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(255,107,107,0.1)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,107,107,0.35)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // PANELES
    panel: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        marginBottom: 14,
        overflow: 'hidden',
    },
    panelHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.08)',
    },
    panelTitleGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    panelTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
    },
    badge: {
        minWidth: 28,
        paddingHorizontal: 8,
        height: 22,
        borderRadius: 11,
        backgroundColor: 'rgba(247,177,118,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: '#F7B176',
        fontSize: 12,
        fontWeight: '700',
    },
    panelBody: {
        paddingVertical: 4,
    },
    panelItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 14,
    },
    itemCol: {
        flex: 1,
        gap: 2,
    },
    itemMain: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    itemSub: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: 12,
    },
    itemCapacity: {
        color: '#F7B176',
        fontSize: 13,
        fontWeight: '700',
    },
    capacityFull: {
        color: '#ff6b6b',
    },
    emptyText: {
        color: 'rgba(255,255,255,0.3)',
        textAlign: 'center',
        paddingVertical: 20,
        fontSize: 13,
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
        height: 70,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    calDayEmpty: {},
    calDayToday: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    calDayActivity: {
        backgroundColor: 'rgba(247,177,118,0.2)',
        borderWidth: 1,
        borderColor: 'rgba(247,177,118,0.45)',
    },
    calDayTodayActivity: {
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
    calDayTextActivity: {
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
