import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { cancelReserve, getReserves } from '../../services/reserveService';
import { userSession } from '../../services/session';

export const ReservesUser = () => {
    const [reserves, setReserves] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const router = useRouter();

    const filteredReserves = useMemo(() =>
        reserves.filter(r => r.activityName.toLowerCase().includes(search.toLowerCase())),
        [reserves, search]
    );

    useEffect(() => {
        loadReserves();
    }, []);

    const loadReserves = async () => {
        try {
            setLoading(true);
            const data = await getReserves();
            const userReserves = data.filter((r: any) =>
                r.userId === userSession.userId &&
                r.state !== 'CANCELED' &&
                r.state !== 'CANCELLED'
            );
            setReserves(userReserves);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Could not load reserves');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = (id: string) => {
        Alert.alert(
            'Cancel Reservation',
            'Are you sure you want to cancel this reservation?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await cancelReserve(id);
                            Alert.alert('Cancelled', 'Reservation cancelled successfully');
                            loadReserves();
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Cancellation failed');
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.reserveCard}>
            <View style={styles.cardInfo}>
                <Text style={styles.activityName}>{item.activityName}</Text>
                <Text style={styles.activityDetails}>
                    {new Date(item.activityDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </Text>
            </View>

            <TouchableOpacity onPress={() => handleCancel(item.id)} style={styles.cancelButton}>
                <MaterialCommunityIcons name="calendar-remove" size={20} color="#ff6b6b" />
                <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.main}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>MY RESERVES</Text>
                    <View style={{ width: 28 }} />
                </View>

                <View style={styles.statsBar}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by activity..."
                        placeholderTextColor="#888"
                        value={search}
                        onChangeText={setSearch}
                    />
                    <Text style={[styles.countText, filteredReserves.length === 0 && styles.countZero]}>
                        {filteredReserves.length} reserve{filteredReserves.length !== 1 ? 's' : ''}
                    </Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#F7B176" style={{ marginTop: 50 }} />
                ) : (
                    <FlatList data={filteredReserves} renderItem={renderItem} keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContainer}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>You dont have any reserves yet</Text>
                        }
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
        letterSpacing: 1.5,
    },
    listContainer: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    reserveCard: {
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
    cancelButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 107, 107, 0.12)',
        borderWidth: 1,
        borderColor: 'rgba(255, 107, 107, 0.4)',
    },
    cancelText: {
        color: '#ff6b6b',
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
    }
});
