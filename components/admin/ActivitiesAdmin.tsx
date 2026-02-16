import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Modal,
    TextInput,
    Alert,
    ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getActivities, createActivity, deleteActivity, updateActivity } from '../../services/activityService';
import { useRouter } from 'expo-router';


export const ActivitiesAdmin = () => {
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingActivity, setEditingActivity] = useState<any | null>(null);
    const router = useRouter();

    // Form state
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    useEffect(() => {
        loadActivities();
    }, []);

    const loadActivities = async () => {
        try {
            setLoading(true);
            const data = await getActivities();
            setActivities(data);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Could not load activities');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (activity?: any) => {
        if (activity) {
            setEditingActivity(activity);
            setName(activity.name);
            setCapacity(activity.capacity.toString());
            setDescription(activity.description || '');

            // Split Date and Time from ISO string (e.g., 2026-02-12T14:30:00)
            const [d, t] = (activity.date || '').split('T');
            setDate(d || '');
            setTime(t ? t.slice(0, 5) : ''); // Take HH:mm
        } else {
            setEditingActivity(null);
            setName('');
            setCapacity('');
            setDescription('');
            setDate(new Date().toISOString().split('T')[0]);
            setTime('12:00');
        }
        setModalVisible(true);
    };

    const handleSave = async () => {
        if (!name || !capacity || !date || !time) {
            Alert.alert('Validation Error', 'Please fill name, capacity, date and time');
            return;
        }

        // Combine Date and Time into ISO format: YYYY-MM-DDTHH:mm:ss
        let formattedTime = time;
        if (time.length === 5) formattedTime += ':00';
        else if (time.length === 0) formattedTime = '00:00:00';

        const fullDateTime = `${date}T${formattedTime}`;

        const activityData = {
            name,
            capacity: parseInt(capacity),
            description,
            date: fullDateTime,
            isActive: true
        };

        try {
            if (editingActivity) {
                await updateActivity(editingActivity.id, activityData);
                Alert.alert('Success', 'Activity updated successfully');
            } else {
                await createActivity(activityData);
                Alert.alert('Success', 'Activity created successfully');
            }
            setModalVisible(false);
            loadActivities();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Operation failed');
        }
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this activity?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteActivity(id);
                            loadActivities();
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Delete failed');
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.activityCard}>
            <View style={styles.cardInfo}>
                <Text style={styles.activityName}>{item.name}</Text>
                <Text style={styles.activityDetails}>Users registered: {item.reservedCount} / {item.capacity}</Text>
            </View>
            <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => handleOpenModal(item)} style={styles.actionButton}>
                    <MaterialCommunityIcons name="pencil" size={24} color="#F7B176" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}>
                    <MaterialCommunityIcons name="trash-can" size={24} color="#ff6b6b" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.overlay}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>MANAGE ACTIVITIES</Text>
                    <TouchableOpacity onPress={() => handleOpenModal()} style={styles.addButton}>
                        <MaterialCommunityIcons name="plus-circle" size={32} color="#F7B176" />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#F7B176" style={{ marginTop: 50 }} />
                ) : (
                    <FlatList
                        data={activities}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContainer}
                        ListEmptyComponent={<Text style={styles.emptyText}>No activities found</Text>}
                    />
                )}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{editingActivity ? 'Edit Activity' : 'Add New Activity'}</Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Activity Name"
                                placeholderTextColor="#888"
                                value={name}
                                onChangeText={setName}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Capacity"
                                placeholderTextColor="#888"
                                value={capacity}
                                onChangeText={setCapacity}
                                keyboardType="numeric"
                            />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Description"
                                placeholderTextColor="#888"
                                value={description}
                                onChangeText={setDescription}
                                multiline
                            />
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <TextInput
                                    style={[styles.input, { flex: 1 }]}
                                    placeholder="Date (YYYY-MM-DD)"
                                    placeholderTextColor="#888"
                                    value={date}
                                    onChangeText={setDate}
                                />
                                <TextInput
                                    style={[styles.input, { flex: 1 }]}
                                    placeholder="Time (HH:mm)"
                                    placeholderTextColor="#888"
                                    value={time}
                                    onChangeText={setTime}
                                />
                            </View>

                            <View style={styles.modalActions}>
                                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSave}>
                                    <Text style={styles.buttonText}>{editingActivity ? 'Update' : 'Create'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 1,
    },
    addButton: {
        padding: 5,
    },
    listContainer: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    activityCard: {
        width: '100%',
        height: 80,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
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
        color: '#aaa',
        marginTop: 4,
    },
    cardActions: {
        flexDirection: 'row',
        gap: 15,
    },
    actionButton: {
        padding: 5,
    },
    emptyText: {
        color: '#888',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#1e1e1e',
        borderRadius: 20,
        padding: 25,
        borderWidth: 1,
        borderColor: 'rgba(247, 177, 118, 0.3)',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#2a2a2a',
        borderRadius: 10,
        paddingHorizontal: 15,
        color: '#fff',
        marginBottom: 15,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
        paddingTop: 10,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    modalButton: {
        width: '45%',
        height: 45,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#444',
    },
    saveButton: {
        backgroundColor: '#F7B176',
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
    }
});
