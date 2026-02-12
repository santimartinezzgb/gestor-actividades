import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export const AdminDashboard = () => {
    const router = useRouter();

    const sections = [
        { id: 'users', title: 'Users', icon: 'account-group', route: '/admin/users' },
        { id: 'activities', title: 'Activities', icon: 'calendar-check', route: '/admin/activities' },
        { id: 'reserves', title: 'Reserves', icon: 'book-clock', route: '/admin/reserves' },
    ];

    return (
        <ImageBackground
            style={styles.container}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <Text style={styles.headerTitle}>ADMIN PANEL</Text>

                <View style={styles.panelOptions}>
                    {sections.map((section) => (
                        <TouchableOpacity
                            key={section.id}
                            style={styles.card}
                            onPress={() => router.push(section.route as any)}
                        >
                            <View style={styles.iconCircle}>
                                <MaterialCommunityIcons name={section.icon as any} size={32} color="#F7B176" />
                            </View>
                            <Text style={styles.cardTitle}>{section.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => router.replace('/login')}
                >
                    <MaterialCommunityIcons name="logout" size={20} color="#ff6b6b" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        height: height,
        backgroundColor: '#121212',
    },
    overlay: {
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
        backdropFilter: 'blur(10px)',
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
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
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
