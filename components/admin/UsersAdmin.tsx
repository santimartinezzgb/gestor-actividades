import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { getUsers, deleteUser } from '../../services/userService';

export const UsersAdmin = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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

    // PARA MANEJAR EL BOTÓN DE ELIMINAR
    const handleDeleteUser = (id: string) => {
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

    // PARA RENDERIZAR CADA ELEMENTO
    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.userCard}>
            <View style={styles.cardInfo}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.userDetails}>{item.name} {item.surname}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteUser(item.id)} style={styles.deleteButton}>
                <MaterialCommunityIcons name="account-remove" size={24} color="#ff6b6b" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.menu}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>MANAGE USERS</Text>
                    <View style={{ width: 28 }} />
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#F7B176" style={{ marginTop: 50 }} />
                ) : (
                    <FlatList
                        data={users}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContainer}
                        ListEmptyComponent={<Text style={styles.emptyText}>No users found</Text>}
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 1,
    },
    listContainer: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    userCard: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
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
        padding: 5,
    },
    emptyText: {
        color: '#888',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    },
});
