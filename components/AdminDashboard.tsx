import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export const AdminDashboard = () => {
    const router = useRouter();

    return (
        <ImageBackground
            style={styles.container}
            resizeMode="cover"
            resizeMethod="scale"
        >
            <Text style={styles.title}>ADMIN</Text>

            <View style={styles.adminInfo}>
                <Text style={styles.title}>ADMIN DASHBOARD</Text>
                <Text style={styles.description}>Welcome, Administrator.</Text>

                <TouchableOpacity
                    style={styles.contenedorLogout}
                    onPress={() => router.replace('/login')}
                >
                    <Text style={styles.btnLogout}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 54,
        width: width,
        height: height,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#222',
        paddingTop: 60,
    },
    title: {
        fontSize: 52,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    adminInfo: {
        alignItems: 'center',
        gap: 10,
    },
    subtitle: {
        fontSize: 24,
        color: '#F7B176',
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        color: '#ccc',
    },
    containerButtons: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 26,
    },
    contenedorLogout: {
        width: '30%',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
        borderWidth: 1,
        borderColor: '#ffffff',
    },
    btnLogout: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: 'bold',
    },
});
