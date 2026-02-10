<script setup>
import { ref, onMounted, nextTick } from 'vue';
// nextTick() TO UPTATE THE VIEW AFTER DATA CHANGES

import { getUsers, deleteUser, getActivities, createActivity, updateActivity, deleteActivity } from '../services/adminService';

const users = ref([]);
const activities = ref([]);
const newActivity = ref({ name: '', description: '', date: '', time: '', capacity: 0, isActive: true });
const showCreateForm = ref(false);
const editActivity = ref(null);
const error = ref('');
const minDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];

async function fetchUsers() {
    try {
        const res = await getUsers();
        // Si el backend devuelve un array o un objeto con users
        users.value = Array.isArray(res) ? res : res.users || [];
    } catch (e) { error.value = e.message; }
}
async function fetchActivities() {
    try {
        activities.value = await getActivities();
    } catch (e) { error.value = e.message; }
}
async function removeUser(id) {
    await deleteUser(id);
    fetchUsers();
}
async function addActivity() {
    // Combina fecha y hora en formato ISO
    const dateTime = `${newActivity.value.date}T${newActivity.value.time}`;
    const activityPayload = { ...newActivity.value, date: dateTime };
    delete activityPayload.time;
    try {
        await createActivity(activityPayload);
        newActivity.value = { name: '', description: '', date: '', time: '', capacity: 0, isActive: true };
        await fetchActivities();
        await nextTick();
        showCreateForm.value = false;
        error.value = '';
    } catch (e) {
        error.value = e.message || 'Error creando actividad';
    }
}
async function editActivitySubmit() {
    // Combina fecha y hora en formato ISO
    const dateTime = `${editActivity.value.date}T${editActivity.value.time}`;
    const activityPayload = { ...editActivity.value, date: dateTime };
    delete activityPayload.time;
    await updateActivity(editActivity.value.id, activityPayload);
    editActivity.value = null;
    await fetchActivities();
    await nextTick();
}
async function removeActivity(id) {
    await deleteActivity(id);
    await fetchActivities();
    await nextTick();
}
function setEditActivity(activity) {
    // Separa fecha y hora para el formulario
    const [date, time] = activity.date ? activity.date.split('T') : ['', ''];
    editActivity.value = { ...activity, date, time };
}
onMounted(() => {
    fetchUsers();
    fetchActivities();
});
</script>

<template>
        <main>
            <div class="admin-container">

                <!-- USERS MANAGEMENT -->
                <section class="adminBox">
                    <h2>Gestión de Usuarios</h2>
                    <div v-if="!users.length && error">Error obteniendo usuarios</div>
                    <div class="user-count">Total usuarios: {{ users.length }}</div>
                    <ul>
                        <li v-for="user in users" :key="user.id">
                            {{ user.username }}
                        </li>
                    </ul>
                </section>

                <!-- ACTIVITIES MANAGEMENT -->
                <section class="adminBox">
                    <h2>Actividades del Gimnasio</h2>
                    <div v-if="!activities.length && error">Error obteniendo actividades</div>
                    <ul>
                        <li v-for="activity in activities" :key="activity.id">
                            <div>
                                <strong style="font-weight: bold;">{{ activity.name }}</strong><br>

                                Fecha: {{ activity.date ? activity.date.split('T')[0] : '' }}<br>

                                Hora: {{ activity.date ? (activity.date.split('T')[1] ? activity.date.split('T')[1].slice(0,5) : '') : '' }}<br>

                                Capacidad: {{ activity.capacity }}<br>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                <button @click="setEditActivity(activity)">Edit</button>
                                <button @click="removeActivity(activity.id)">Delete</button>
                            </div>
                        </li>
                    </ul>
                    <button v-if="!showCreateForm" @click="showCreateForm = true" class="btnNewActivity">
                        Add new activity
                    </button>



                    <!-- ACTIVITY EDIT FORM -->
                    <form v-if="editActivity" @submit.prevent="editActivitySubmit">
                        <input v-model="editActivity.name" placeholder="Nombre" required />
                        <input v-model="editActivity.description" placeholder="Descripción" required />
                        <div class="dateTimeFields">
                            <input v-model="editActivity.date" type="date" required />
                            <input v-model="editActivity.time" type="time" required />
                        </div>
                        <input v-model.number="editActivity.capacity" placeholder="Capacidad" type="number" required />
                        <label>
                            Activa <input v-model="editActivity.isActive" type="checkbox" />
                        </label>
                        <button type="submit">Guardar Cambios</button>
                        <button type="button" @click="editActivity = null">Cancelar</button>
                    </form>
                </section>
            </div>
            
            <!-- ACTIVITY CREATION FORM -->
            <form v-if="showCreateForm" @submit.prevent="addActivity" class="newActivity">
                <input v-model="newActivity.name" placeholder="Nombre" required />
                <input v-model="newActivity.description" placeholder="Descripción" required />
                <div class="dateTimeFields">
                    <input v-model="newActivity.date" type="date" required />
                    <input v-model="newActivity.time" type="time" required />
                </div>
                <input v-model.number="newActivity.capacity" placeholder="Capacidad" type="number" required />
                <button type="submit">Crear Actividad</button>
                <button type="button" @click="showCreateForm = false" class="cancel-btn">Cancel</button>
                
            </form>
        </main>
</template>

<style scoped>
    main {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 100vh;
        background-image: linear-gradient(rgba(0, 0, 0, 0.8), 
                            rgba(0, 0, 0, 0.8)), url("../assets/image.svg");
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        color: white;
    }
    .user-count {
        font-size: 1.2rem;
        font-weight: bold;
        margin-bottom: 1rem;
        color: #F7B176;
    }
    .error-msg {
        color: #ff6b6b;
        font-weight: bold;
        margin-top: 0.7rem;
    }
    .cancel-btn {
        background: #ff6b6b;
        color: #fff;
        border: none;
        border-radius: 0.3rem;
        padding: 0.4rem 1rem;
        cursor: pointer;
        font-weight: bold;
        margin-top: 0.7rem;
        transition: background 0.2s;
    }
    .cancel-btn:hover {
        background: #d32f2f;
    }
    .btnNewActivity {
        background: #222;
        color: #F7B176;
        border: 1px solid #F7B176;
        border-radius: 0.3rem;
        padding: 0.4rem 1rem;
        cursor: pointer;
        font-weight: bold;
        margin-bottom: 1rem;
        transition: background 0.2s, color 0.2s;
    }
    .btnNewActivity:hover {
        background: #F7B176;
        color: #222;
    }
    .dateTimeFields {
        display: flex;
        gap: 0.5rem;
    }
    .admin-container {
        display: flex;
        flex-direction: row;
        gap: 3rem;
        width: 80vw;
        justify-content: center;
        align-items: flex-start;
    }
    .adminBox {
        background: #222;
        border-radius: 1rem;
        padding: 2rem;
        width: 1000px;
        height: 800px;
        box-shadow: 0 4px 24px rgba(247, 177, 118, 0.15);
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    .adminBox h2 {
        color: #F7B176;
        margin-bottom: 1rem;
    }
    .adminBox ul {
        list-style: none;
        padding: 0;
    }
    .adminBox li {
        background: #444;
        border-radius: 0.5rem;
        margin-bottom: 0.7rem;
        padding: 0.7rem 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }
    .adminBox button {
        background: #F7B176;
        color: #222;
        border: none;
        border-radius: 0.3rem;
        padding: 0.4rem 1rem;
        cursor: pointer;
        font-weight: bold;
        transition: background 0.2s;
    }
    .adminBox button:hover {
        background: #ffb76b;
    }
    .adminBox form {
        display: flex;
        flex-direction: column;
        gap: 0.7rem;
    }
    .adminBox input[type="text"],
    .adminBox input[type="number"],
    .adminBox input[type="datetime-local"] {
        padding: 0.5rem;
        border-radius: 0.3rem;
        border: none;
        margin-bottom: 0.3rem;
    }
    .adminBox label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    



    /* NEW ACTIVITY */
    .newActivity{
        position: absolute;
        padding: 2rem;  
        display: flex;
        flex-direction: column;
        gap: 2rem;

        justify-content: center;
        align-items: center;
        background-image: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8));
        color: white;
    } 
</style>
