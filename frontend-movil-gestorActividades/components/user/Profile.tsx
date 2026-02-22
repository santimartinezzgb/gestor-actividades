import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { userSession } from '../../services/session';
import { getUserById, updatePassword } from '../../services/userService';

export const Profile = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [updating, setUpdating] = useState(false);
    const router = useRouter();

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            setLoading(true);
            const data = await getUserById(userSession.userId);
            setUser(data);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Could not load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }

        try {
            setUpdating(true);
            await updatePassword(userSession.userId, oldPassword, newPassword);
            Alert.alert('Success', 'Password updated successfully');
            setModalVisible(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F7B176" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.main}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>MY PROFILE</Text>
                    <View style={{ width: 28 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarCircle}>
                            <MaterialCommunityIcons name="account" size={80} color="#F7B176" />
                        </View>
                        <Text style={styles.userName}>{user?.name} {user?.surname}</Text>
                        <Text style={styles.userRole}>@{user?.username}</Text>
                    </View>

                    <View style={styles.infoSection}>
                        <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="email-outline" size={24} color="#F7B176" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>Username</Text>
                                <Text style={styles.infoValue}>{user?.username}</Text>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="book-check-outline" size={24} color="#F7B176" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>Total Reserves</Text>
                                <Text style={styles.infoValue}>{user?.totalReserves || 0}</Text>
                            </View>
                        </View>

                    </View>

                    <TouchableOpacity style={styles.changePasswordButton} onPress={() => setModalVisible(true)}>
                        <MaterialCommunityIcons name="lock-reset" size={24} color="#fff" />
                        <Text style={styles.buttonText}>Change password</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>

                <View style={styles.modalmain}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Change password</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            placeholder="Current password"
                            placeholderTextColor="#666"
                            value={oldPassword}
                            onChangeText={setOldPassword}
                        />

                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            placeholder="New password (min 6 chars)"
                            placeholderTextColor="#666"
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />

                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            placeholder="Confirm new password"
                            placeholderTextColor="#666"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />

                        <TouchableOpacity style={[styles.submitButton, updating && styles.disabledButton]}
                            onPress={handleChangePassword} disabled={updating}>
                            {updating ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.submitButtonText}>Update password</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#121212',
        justifyContent: 'center',
        alignItems: 'center'
    },
    main: {
        flex: 1,
        gap: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 30,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 30,
        gap: 40,
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
    scrollContainer: {
        paddingBottom: 40,
        alignItems: 'center'
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 40,
    },
    avatarCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(247, 177, 118, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#F7B176',
        marginBottom: 15,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    userRole: {
        fontSize: 14,
        color: '#F7B176',
        marginTop: 5,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    infoSection: {
        width: '90%',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 14,
        padding: 20,
        marginBottom: 30,
        borderWidth: 1.5,
        borderColor: 'rgba(247, 177, 118, 0.18)',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    infoTextContainer: {
        marginLeft: 15,
    },
    infoLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '500',
    },
    changePasswordButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(247, 177, 118, 0.2)',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F7B176',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    modalmain: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#1e1e1e',
        borderRadius: 20,
        padding: 25,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 10,
        padding: 12,
        color: '#fff',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    submitButton: {
        backgroundColor: '#F7B176',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.5,
    }
});
