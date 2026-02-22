import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { createActivity, deleteActivity, getActivities, updateActivity } from '../../services/activityService';


export const ActivitiesAdmin = () => {
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingActivity, setEditingActivity] = useState<any | null>(null);
    const router = useRouter();

    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [search, setSearch] = useState('');

    const filteredActivities = useMemo(() =>
        activities.filter(a => a.name.toLowerCase().includes(search.toLowerCase())),
        [activities, search]
    );

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

    const createOrUpdateActivity = (activity?: any) => {
        const [d, t] = (activity?.date || '').split('T');
        setEditingActivity(activity || null);
        setName(activity?.name || '');
        setCapacity(activity?.capacity?.toString() || '');
        setDescription(activity?.description || '');
        setDate(activity ? d : new Date().toISOString().split('T')[0]);
        setTime(activity ? (t?.slice(0, 5) || '') : '12:00');
        setModalVisible(true);
    };

    const handleSave = async () => {
        if (!name || !capacity || !date || !time) return Alert.alert('Validation Error', 'Please fill name, capacity, date and time');

        const activityData = {
            name,
            capacity: parseInt(capacity),
            description,
            date: `${date}T${time.length === 5 ? time + ':00' : (time || '12:00:00')}`,
            isActive: true
        };

        try {
            await (editingActivity ? updateActivity(editingActivity.id, activityData) : createActivity(activityData));
            Alert.alert('Success', `Activity ${editingActivity ? 'updated' : 'created'} successfully`);
            setModalVisible(false);
            loadActivities();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const handleDelete = (id: string) => {
        Alert.alert('Confirm Delete', 'Are you sure you want to delete this activity?', [
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
        ]);
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.activityCard}>

            <View style={styles.cardInfo}>
                <Text style={styles.activityName}>{item.name}</Text>
                <Text style={styles.activityDetails}>Users registered: {item.reservedCount} / {item.capacity}</Text>
            </View>

            <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => createOrUpdateActivity(item)} style={styles.actionButton}>
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
            <View style={styles.menu}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>MANAGE ACTIVITIES</Text>
                    <TouchableOpacity onPress={() => createOrUpdateActivity()} style={styles.addButton}>
                        <MaterialCommunityIcons name="plus-circle" size={32} color="#F7B176" />
                    </TouchableOpacity>
                </View>

                <View style={styles.statsBar}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by name..."
                        placeholderTextColor="#888"
                        value={search}
                        onChangeText={setSearch}
                    />
                    <Text style={[styles.countText, filteredActivities.length === 0 && styles.countZero]}>
                        {filteredActivities.length} activit{filteredActivities.length !== 1 ? 'ies' : 'y'}
                    </Text>
                </View>

                {loading
                    ? <ActivityIndicator size="large" color="#F7B176" style={{ marginTop: 50 }} />
                    : <FlatList data={filteredActivities} renderItem={renderItem} keyExtractor={i => i.id}
                        contentContainerStyle={styles.listContainer}
                        ListEmptyComponent={<Text style={styles.emptyText}>No activities found</Text>} />
                }

                <Modal animationType="slide" transparent={true} visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}>
                    <View style={styles.modalmenu}>
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
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
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
        color: '#aaa',
        marginTop: 4,
    },
    cardActions: {
        flexDirection: 'row',
        gap: 15,
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.14)',
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
    modalmenu: {
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
