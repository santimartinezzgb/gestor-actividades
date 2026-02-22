import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getActivities } from '../../services/activityService';
import { createReserve } from '../../services/reserveService';
import { userSession } from '../../services/session';

export const ActivitiesUser = () => {
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const router = useRouter();

    const filteredActivities = useMemo(() =>
        activities.filter(a => a.name.toLowerCase().includes(search.toLowerCase())),
        [activities, search]
    );

    useEffect(() => {
        loadActivities();
    }, []);

    const loadActivities = async () => {
        try {
            setLoading(true);
            const data = await getActivities();
            setActivities(data);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReserve = async (activityId: string) => {
        if (!userSession.userId) {
            Alert.alert('Error', 'Session not found. Please log in again.');
            router.replace('/login');
            return;
        }

        try {
            await createReserve(userSession.userId, activityId);
            Alert.alert('Success', 'Activity reserved successfully! Check "My Reserves" section.');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        const isFull = item.reservedCount >= item.capacity;

        return (
            <View style={[styles.activityCard, isFull && styles.fullCard]}>
                <View style={styles.cardInfo}>
                    <Text style={styles.activityName}>{item.name}</Text>
                    <Text style={styles.activityDetails}>
                        {new Date(item.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </Text>
                    <Text style={[styles.capacityInfo, isFull && styles.fullText]}>
                        {isFull ? 'FULL' : `Available: ${item.capacity - item.reservedCount} / ${item.capacity}`}
                    </Text>
                </View>

                <TouchableOpacity onPress={() => handleReserve(item.id)}
                    style={[styles.reserveButton, isFull && styles.disabledButton]} disabled={isFull}>
                    <MaterialCommunityIcons
                        name={isFull ? "calendar-remove" : "calendar-plus"}
                        size={20}
                        color={isFull ? "#888" : "#F7B176"}
                    />
                    <Text style={[styles.reserveText, isFull && styles.disabledText]}>
                        {isFull ? 'Full' : 'Reserve'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.main}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>AVAILABLE ACTIVITIES</Text>
                    <View style={{ width: 28 }} />
                </View>

                <View style={styles.statsBar}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by name..."
                        placeholderTextColor="#888"
                        value={search}
                        onChangeText={setSearch}
                    />
                    <Text style={[styles.countText, filteredActivities.length === 0 && styles.countZero]}>
                        {filteredActivities.length} activit{filteredActivities.length !== 1 ? 'ies' : 'y'}
                    </Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#F7B176" style={{ marginTop: 50 }} />
                ) : (
                    < FlatList
                        data={filteredActivities}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContainer}
                        ListEmptyComponent={<Text style={styles.emptyText}>No activities available</Text>}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    main: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 20,
        gap: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingTop: 20,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 1.4,
    },
    listContainer: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    activityCard: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginBottom: 12,
        borderWidth: 1.5,
        borderColor: 'rgba(247, 177, 118, 0.18)',
    },
    cardInfo: {
        flex: 1,
    },
    activityName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    activityDetails: {
        fontSize: 14,
        color: '#F7B176',
        marginTop: 4,
    },
    capacityInfo: {
        fontSize: 12,
        color: '#aaa',
        marginTop: 4,
    },
    reserveButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: 'rgba(247, 177, 118, 0.12)',
        borderWidth: 1,
        borderColor: 'rgba(247, 177, 118, 0.4)',
    },
    reserveText: {
        color: '#F7B176',
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 4,
    },
    statsBar: {
        paddingHorizontal: 15,
        gap: 8,
    },
    countText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F7B176',
        margin: 15,
        textAlign: 'center',
    },
    countZero: {
        color: '#ff6b6b',
    },
    searchInput: {
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 10,
        paddingHorizontal: 12,
        color: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(247, 177, 118, 0.25)',
        fontSize: 14,
    },
    emptyText: {
        color: '#888',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    },
    fullCard: {
        borderColor: 'rgba(255, 0, 0, 0.2)',
        backgroundColor: 'rgba(255, 0, 0, 0.05)',
    },
    fullText: {
        color: '#ff6b6b',
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.5,
    },
    disabledText: {
        color: '#888',
    }
});
