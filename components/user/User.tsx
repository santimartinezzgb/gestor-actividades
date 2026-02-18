import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const User = () => {
    const router = useRouter();

    // SECCIONES DEL PANEL DE USUARIO
    // ID. Id para cada sección
    // TITLE. Título que se muestra en la tarjeta
    // ICON. Icono de MaterialCommunityIcons ( Librería de iconos de React Native ) que se muestra en la tarjeta
    // ROUTE. Ruta a la que se navega al hacer clic en la tarjeta
    const sections = [
        { id: 'profile', title: 'My Profile', icon: 'account-circle', route: '/user/profile' },
        { id: 'reserves', title: 'My Reserves', icon: 'book-clock', route: '/user/reserves' },
        { id: 'activities', title: 'Activities', icon: 'calendar-search', route: '/user/activities' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.main}>
                <Text style={styles.headerTitle}>MY DASHBOARD</Text>

                {/* TARJETAS DE NAVEGACIÓN */}
                <View style={styles.panelOptions}>
                    {sections.map((section) => (
                        <TouchableOpacity key={section.id} style={styles.card} onPress={() => router.push(section.route as any)} >
                            <View style={styles.iconCircle}>
                                <MaterialCommunityIcons name={section.icon as any} size={32} color="#F7B176" />
                            </View>
                            <Text style={styles.cardTitle}>{section.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* BOTÓN DE CERRAR SESIÓN */}
                <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/login')}>
                    <MaterialCommunityIcons name="logout" size={20} color="#ff6b6b" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
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
        paddingHorizontal: 20,
        paddingTop: 80,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 60,
        letterSpacing: 2,
    },
    panelOptions: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    card: {
        width: '45%',
        aspectRatio: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(247, 177, 118, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
        textAlign: 'center',
    },
    logoutButton: {
        position: 'absolute',
        bottom: 50,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#ff6b6b',
    },
    logoutText: {
        fontSize: 16,
        color: '#ff6b6b',
        fontWeight: 'bold',
    },
});