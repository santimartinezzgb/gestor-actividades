<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getActivities, createActivity, updateActivity, deleteActivity } from '@/services/activity/activityService';

const router = useRouter();
const activities = ref<any[]>([]);
const loading = ref(true);
const modalVisible = ref(false);
const editingActivity = ref<any>(null);

// Form fields
const name = ref('');
const capacity = ref('');
const description = ref('');
const date = ref('');
const time = ref('');

onMounted(() => loadActivities());

const loadActivities = async () => {
    try {
        loading.value = true;
        activities.value = await getActivities();
    } catch (e: any) {
        alert(e.message || 'Could not load activities');
    } finally {
        loading.value = false;
    }
};

const handleOpenModal = (activity?: any) => {
    const [d, t] = (activity?.date || '').split('T');
    editingActivity.value = activity || null;
    name.value = activity?.name || '';
    capacity.value = activity?.capacity?.toString() || '';
    description.value = activity?.description || '';
    date.value = activity ? d : new Date().toISOString().split('T')[0];
    time.value = activity ? (t?.slice(0, 5) || '') : '12:00';
    modalVisible.value = true;
};

const handleSave = async () => {
    if (!name.value || !capacity.value || !date.value || !time.value) {
        alert('Please fill name, capacity, date and time');
        return;
    }
    const activityData = {
        name: name.value,
        capacity: parseInt(capacity.value),
        description: description.value,
        date: `${date.value}T${time.value.length === 5 ? time.value + ':00' : (time.value || '12:00:00')}`,
        isActive: true
    };
    try {
        if (editingActivity.value) {
            await updateActivity(editingActivity.value.id, activityData);
            alert('Activity updated successfully');
        } else {
            await createActivity(activityData);
            alert('Activity created successfully');
        }
        modalVisible.value = false;
        loadActivities();
    } catch (e: any) {
        alert(e.message || 'Operation failed');
    }
};

const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    try {
        await deleteActivity(id);
        loadActivities();
    } catch (e: any) {
        alert(e.message || 'Delete failed');
    }
};

const closeModal = () => {
    modalVisible.value = false;
    editingActivity.value = null;
};
</script>

<template>
    <main>
        <div class="overlay">
            <div class="header">
                <button class="back-button" @click="router.push('/admin')">←</button>
                <h2 class="header-title">MANAGE ACTIVITIES</h2>
                <button class="add-button" @click="handleOpenModal()">➕</button>
            </div>

            <div v-if="loading" class="loading">Loading...</div>

            <div v-else class="list-container">
                <p v-if="!activities.length" class="empty-text">No activities found</p>
                <div v-for="item in activities" :key="item.id" class="activity-card">
                    <div class="card-info">
                        <span class="activity-name">{{ item.name }}</span>
                        <span class="activity-details">Users registered: {{ item.reservedCount }} / {{ item.capacity }}</span>
                    </div>
                    <div class="card-actions">
                        <button class="edit-btn" @click="handleOpenModal(item)">✏️</button>
                        <button class="delete-btn" @click="handleDelete(item.id)">🗑️</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal crear/editar actividad -->
        <div v-if="modalVisible" class="modal-overlay" @click.self="closeModal">
            <div class="modal-content">
                <h3 class="modal-title">{{ editingActivity ? 'Edit Activity' : 'Add New Activity' }}</h3>
                <input v-model="name" placeholder="Activity Name" class="modal-input" />
                <input v-model="capacity" placeholder="Capacity" type="number" class="modal-input" />
                <textarea v-model="description" placeholder="Description" class="modal-input textarea"></textarea>
                <div class="date-time-row">
                    <input v-model="date" type="date" class="modal-input" />
                    <input v-model="time" type="time" class="modal-input" />
                </div>
                <div class="modal-actions">
                    <button class="cancel-btn" @click="closeModal">Cancel</button>
                    <button class="save-btn" @click="handleSave">
                        {{ editingActivity ? 'Update' : 'Create' }}
                    </button>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
main {
    width: 100vw;
    height: 100vh;
    background-color: #121212;
    position: relative;
}
.overlay {
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    padding-top: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 90%;
    max-width: 800px;
    margin-bottom: 20px;
}
.back-button, .add-button {
    background: transparent;
    border: none;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 5px;
}
.add-button {
    font-size: 1.8rem;
}
.header-title {
    font-size: 1.3rem;
    font-weight: bold;
    color: #fff;
    letter-spacing: 1px;
}
.loading {
    color: #F7B176;
    font-size: 1.2rem;
    margin-top: 50px;
}
.list-container {
    width: 90%;
    max-width: 800px;
    overflow-y: auto;
    padding-bottom: 20px;
}
.activity-card {
    width: 100%;
    height: 70px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    margin-bottom: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.2s;
}
.activity-card:hover {
    background: rgba(255, 255, 255, 0.12);
}
.card-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.activity-name {
    font-size: 1.1rem;
    font-weight: bold;
    color: #fff;
}
.activity-details {
    font-size: 0.85rem;
    color: #aaa;
}
.card-actions {
    display: flex;
    gap: 12px;
}
.edit-btn, .delete-btn {
    background: transparent;
    border: none;
    font-size: 1.3rem;
    cursor: pointer;
    padding: 5px;
    transition: transform 0.2s;
}
.edit-btn:hover, .delete-btn:hover {
    transform: scale(1.2);
}
.empty-text {
    color: #888;
    text-align: center;
    margin-top: 50px;
    font-size: 1rem;
}

/* Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
.modal-content {
    width: 90%;
    max-width: 500px;
    background: #1e1e1e;
    border-radius: 20px;
    padding: 25px;
    border: 1px solid rgba(247, 177, 118, 0.3);
}
.modal-title {
    font-size: 1.4rem;
    font-weight: bold;
    color: #fff;
    margin-bottom: 20px;
    text-align: center;
}
.modal-input {
    width: 100%;
    height: 50px;
    background: #2a2a2a;
    border-radius: 10px;
    padding: 0 15px;
    color: #fff;
    margin-bottom: 15px;
    border: none;
    font-size: 0.95rem;
    box-sizing: border-box;
}
.modal-input::placeholder {
    color: #888;
}
.textarea {
    height: 80px;
    padding: 12px 15px;
    resize: vertical;
    font-family: inherit;
}
.date-time-row {
    display: flex;
    gap: 10px;
}
.date-time-row .modal-input {
    flex: 1;
}
.modal-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    gap: 15px;
}
.cancel-btn, .save-btn {
    flex: 1;
    height: 45px;
    border-radius: 10px;
    border: none;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    transition: opacity 0.2s;
}
.cancel-btn {
    background: #444;
    color: #fff;
}
.save-btn {
    background: #F7B176;
    color: #222;
}
.cancel-btn:hover, .save-btn:hover {
    opacity: 0.85;
}
</style>
