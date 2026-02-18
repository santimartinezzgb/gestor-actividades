import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { cancelReserve, getReserves } from '../../services/reserveService';
import { userSession } from '../../services/session';

export const ReservesUser = () => {
    // ESTADOS
    const [reserves, setReserves] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // PARA CARGAR DATOS AL INICIAR EL COMPONENTE
    useEffect(() => {
        loadReserves();
    }, []);

    // CARGAR LAS RESERVAS DEL USUARIO ACTUAL
    const loadReserves = async () => {
        try {
            setLoading(true);
            const data = await getReserves();
            // FILTRO PARA RESERVAS NO CANCELADAS
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

    // MANEJAR CANCELACIÓN DE RESERVA
    const handleCancel = (id: string) => {

        // CONFIRMAR ANTES DE CANCELAR
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

        // TARJETA DE CADA RESERVA
        <View style={styles.reserveCard}>

            {/* INFORMACIÓN DE LA RESERVA */}
            <View style={styles.cardInfo}>
                <Text style={styles.activityName}>{item.activityName}</Text>
                <Text style={styles.activityDetails}>
                    {new Date(item.activityDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </Text>
            </View>

            {/* BOTÓN DE CANCELAR RESERVA */}
            <TouchableOpacity onPress={() => handleCancel(item.id)} style={styles.cancelButton}>
                <MaterialCommunityIcons name="calendar-remove" size={24} color="#ff6b6b" />
                <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.overlay}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>MY RESERVES</Text>
                    <View style={{ width: 28 }} />
                </View>

                {/* LISTA DE RESERVAS O INDICADOR DE CARGA */}
                {loading ? (
                    <ActivityIndicator size="large" color="#F7B176" style={{ marginTop: 50 }} />
                ) : (
                    <FlatList data={reserves} renderItem={renderItem} keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContainer}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>You dont have any reserves yet</Text>
                        } /* SI NO HAY RESERVAS, MUESTRA ESTE MENSAJE */
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
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingTop: 60,
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 1,
    },
    listContainer: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    reserveCard: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
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
    statusBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 8,
    },
    statusText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    cancelButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
    },
    cancelText: {
        color: '#ff6b6b',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 4,
    },
    emptyText: {
        color: '#888',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    }
});
