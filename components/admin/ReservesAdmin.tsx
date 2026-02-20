import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { cancelReserve, getReserves } from '../../services/reserveService';

export const ReservesAdmin = () => {
    // ESTADOS
    const [reserves, setReserves] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // PARA CARGAR DATOS
    useEffect(() => {
        loadReserves();
    }, []);

    // PARA CARGAR LAS RESERVAS
    const loadReserves = async () => {
        try {
            setLoading(true);
            const data = await getReserves();
            setReserves(data.filter((r: any) => r.state !== 'CANCELLED' && r.state !== 'CANCELED'));
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Could not load reserves');
        } finally {
            setLoading(false);
        }
    };

    // PARA MANEJAR EL BOTÓN DE CANCELAR
    const handleCancelReserve = (id: string) => {

        // CONFIRMAR ANTES DE CANCELAR
        Alert.alert('Confirm Cancel', 'Are you sure you want to cancel this reservation?', [
            { text: 'No', style: 'cancel' },
            {
                text: 'Yes, Cancel',
                style: 'destructive',
                onPress: async () => {
                    try {
                        // CANCELAR RESERVA Y RECARGAR DATOS
                        await cancelReserve(id);
                        Alert.alert('Success', 'Reservation cancelled successfully');
                        loadReserves();
                    } catch (error: any) {
                        Alert.alert('Error', error.message || 'Cancellation failed');
                    }
                }
            }
        ]);
    };

    // PARA RENDERIZAR LAS RESERVAS EN LA FLATLIST
    const renderItem = ({ item }: { item: any }) => (
        // TARJETA DE CADA RESERVA
        <View style={styles.reserveCard}>

            {/* INFORMACIÓN DE LA RESERVA */}
            <View style={styles.cardInfo}>
                <Text style={styles.activityName}>{item.activityName}</Text>
                <Text style={styles.username}>User: {item.username}</Text>
                <Text style={styles.date}>
                    {new Date(item.activityDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </Text>
            </View>

            {/* ACCIÓN DE CANCELAR RESERVA */}
            {item.state !== 'CANCELLED' && (
                <TouchableOpacity onPress={() => handleCancelReserve(item.id)} style={styles.actionButton}>
                    <MaterialCommunityIcons name="calendar-remove" size={24} color="#ff6b6b" />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.overlay}>

                {/* CABECERA */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>MANAGE RESERVES</Text>
                    <View style={{ width: 28 }} />
                </View>

                {/* MIENTRAS CARGA: MUESTRA LOADING, SINO MUESTRA LA LISTA DE RESERVAS */}
                {loading ? (
                    <ActivityIndicator size="large" color="#F7B176" style={{ marginTop: 50 }} />
                ) : (
                    <FlatList
                        data={reserves}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContainer}
                        ListEmptyComponent={<Text style={styles.emptyText}>No reserves found</Text>}
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
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingTop: 34,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 1.4,
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
    username: {
        fontSize: 14,
        color: '#F7B176',
        marginTop: 2,
    },
    date: {
        fontSize: 12,
        color: '#aaa',
        marginTop: 2,
    },
    state: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 5,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    confirmed: {
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        color: '#4caf50',
    },
    cancelled: {
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
        color: '#ff6b6b',
    },
    actionButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 107, 107, 0.12)',
        borderWidth: 1,
        borderColor: 'rgba(255, 107, 107, 0.35)',
    },
    emptyText: {
        color: '#888',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    },
});
