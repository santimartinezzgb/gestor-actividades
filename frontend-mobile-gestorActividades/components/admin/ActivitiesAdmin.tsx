import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
    // ESTADOS
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingActivity, setEditingActivity] = useState<any | null>(null);
    const router = useRouter();

    // ESTADOS DEL FORMULARIO
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    // PARA CARGAR DATOS
    useEffect(() => {
        loadActivities();
    }, []);

    // PARA CARGAR ACTIVIDADES
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

    // CREAR O ACTUALIZAR ACTIVIDAD
    const createOrUpdateActivity = (activity?: any) => {
        const [d, t] = (activity?.date || '').split('T');

        // SETEAR CAMPOS DEL FORMULARIO
        setEditingActivity(activity || null);
        setName(activity?.name || '');
        setCapacity(activity?.capacity?.toString() || '');
        setDescription(activity?.description || '');
        setDate(activity ? d : new Date().toISOString().split('T')[0]);
        setTime(activity ? (t?.slice(0, 5) || '') : '12:00');
        setModalVisible(true);
    };

    // PARA MANEJAR EL BOTÓN DE GUARDAR
    const handleSave = async () => {
        // VALIDACIÓN BÁSICA
        if (!name || !capacity || !date || !time) return Alert.alert('Validation Error', 'Please fill name, capacity, date and time');

        // CREAR OBJETO DE ACTIVIDAD
        const activityData = {
            name,
            capacity: parseInt(capacity),
            description,
            // Parseando la fecha y hora a formato ISO
            date: `${date}T${time.length === 5 ? time + ':00' : (time || '12:00:00')}`,
            isActive: true
        };

        try {
            // SI EDITA RECIBE EL ID, SINO CREA NUEVO
            await (editingActivity ? updateActivity(editingActivity.id, activityData) : createActivity(activityData));

            // MENSAJE DE ÉXITO Y RECARGAR DATOS
            Alert.alert('Success', `Activity ${editingActivity ? 'updated' : 'created'} successfully`);
            setModalVisible(false);
            loadActivities();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    // PARA MANEJAR EL BOTÓN DE ELIMINAR LA ACTIVIDAD
    const handleDelete = (id: string) => {

        // CONFIRMAR ANTES DE ELIMINAR
        Alert.alert('Confirm Delete', 'Are you sure you want to delete this activity?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        // ELIMINAR ACTIVIDAD Y RECARGAR DATOS
                        await deleteActivity(id);
                        loadActivities();
                    } catch (error: any) {
                        Alert.alert('Error', error.message || 'Delete failed');
                    }
                }
            }
        ]);
    };

    // PARA RENDERIZAR LAS ACTIVIDADES EN LA FLATLIST
    const renderItem = ({ item }: { item: any }) => (
        // TARJETA DE CADA ACTIVIDAD
        <View style={styles.activityCard}>

            {/* INFORMACIÓN DE LA ACTIVIDAD */}
            <View style={styles.cardInfo}>
                <Text style={styles.activityName}>{item.name}</Text>
                <Text style={styles.activityDetails}>Users registered: {item.reservedCount} / {item.capacity}</Text>
            </View>

            {/* ACCIONES DE CREAR/EDITAR Y ELIMINAR */}
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

                {/* CABECERA */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>MANAGE ACTIVITIES</Text>
                    <TouchableOpacity onPress={() => createOrUpdateActivity()} style={styles.addButton}>
                        <MaterialCommunityIcons name="plus-circle" size={32} color="#F7B176" />
                    </TouchableOpacity>
                </View>

                {/* MIENTRAS CARGA: MUESTRA LOADING, SINO MUESTRA LA LISTA DE ACTIVIDADES */}
                {loading
                    ? <ActivityIndicator size="large" color="#F7B176" style={{ marginTop: 50 }} />
                    : <FlatList data={activities} renderItem={renderItem} keyExtractor={i => i.id}
                        contentContainerStyle={styles.listContainer}
                        ListEmptyComponent={<Text style={styles.emptyText}>No activities found</Text>} />
                }

                {/* MODAL PARA CREAR O EDITAR ACTIVIDAD */}
                <Modal animationType="slide" transparent={true} visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}>

                    {/* CONTENIDO DEL MODAL */}
                    <View style={styles.modalmenu}>
                        <View style={styles.modalContent}>

                            {/* CAMPOS DEL FORMULARIO */}
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

                            {/* ACCIONES ( CANCELAR Y GUARDAR ) */}
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
