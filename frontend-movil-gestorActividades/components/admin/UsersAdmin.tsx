import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { deleteUser, getUsers } from '../../services/userService';

export const UsersAdmin = () => {
    // ESTADOS
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const router = useRouter();

    // FILTRAR USUARIOS POR NOMBRE
    const filteredUsers = useMemo(() =>
        users.filter(u => u.username.toLowerCase().includes(search.toLowerCase())),
        [users, search]
    );

    // PARA CARGAR DATOS
    useEffect(() => {
        loadUsers();
    }, []);

    // PARA CARGAR LOS USUARIOS
    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await getUsers('ROLE_USER');
            setUsers(data);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Could not load users');
        } finally {
            setLoading(false);
        }
    };

    // PARA MANEJAR EL BOTÓN DE ELIMINAR EL USUARIO
    const handleDeleteUser = (id: string) => {

        // CONFIRMAR ANTES DE ELIMINAR
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this user?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // ELIMINAR USUARIO Y RECARGAR DATOS
                            await deleteUser(id);
                            Alert.alert('Success', 'User deleted successfully');
                            loadUsers();
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Delete failed');
                        }
                    }
                }
            ]
        );
    };

    // PARA RENDERIZAR LOS USUARIOS EN LA FLATLIST
    const renderItem = ({ item }: { item: any }) => (
        // TARJETA DE CADA USUARIO
        <View style={styles.userCard}>

            {/* INFORMACIÓN DEL USUARIO */}
            <View style={styles.cardInfo}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.userDetails}>{item.name} {item.surname}</Text>
            </View>

            {/* ACCIÓN DE ELIMINAR */}
            <TouchableOpacity onPress={() => handleDeleteUser(item.id)} style={styles.deleteButton}>
                <MaterialCommunityIcons name="account-remove" size={24} color="#ff6b6b" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.menu}>

                {/* CABECERA */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>MANAGE USERS</Text>
                    <View style={{ width: 28 }} />
                </View>

                {/* BARRA DE FILTROS */}
                <View style={styles.statsBar}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by username..."
                        placeholderTextColor="#888"
                        value={search}
                        onChangeText={setSearch}
                    />
                    <Text style={[styles.countText, filteredUsers.length === 0 && styles.countZero]}>
                        {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
                    </Text>
                </View>

                {/* MIENTRAS CARGA: MUESTRA LOADING, SINO MUESTRA LA LISTA DE USUARIOS */}
                {loading ? (
                    <ActivityIndicator size="large" color="#F7B176" style={{ marginTop: 50 }} />
                ) : (
                    <FlatList data={filteredUsers} renderItem={renderItem} keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContainer} ListEmptyComponent={
                            <Text style={styles.emptyText}>No users found</Text>
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
    menu: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 40,
        gap: 20,
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 2,
    },
    listContainer: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    userCard: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        marginBottom: 12,
        borderWidth: 1.5,
        borderColor: 'rgba(247, 177, 118, 0.18)',
    },
    cardInfo: {
        flex: 1,
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    userDetails: {
        fontSize: 14,
        color: '#aaa',
        marginTop: 4,
    },
    deleteButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 107, 107, 0.12)',
        borderWidth: 1,
        borderColor: 'rgba(255, 107, 107, 0.35)',
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
});
