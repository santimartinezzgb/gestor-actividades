<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, Trash2 } from 'lucide-vue-next';
import { getUsers, deleteUser } from '@/services/user/userService';

const router = useRouter();
const users = ref<any[]>([]);
const loading = ref(true);

onMounted(() => loadUsers());

const loadUsers = async () => {
    try {
        loading.value = true;
        users.value = await getUsers('ROLE_USER');
    } catch (e: any) {
        alert(e.message || 'Could not load users');
    } finally {
        loading.value = false;
    }
};

const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
        await deleteUser(id);
        loadUsers();
    } catch (e: any) {
        alert(e.message || 'Delete failed');
    }
};
</script>

<template>
    <main>
        <div class="overlay">
            <div class="header">
                <button class="back-button" @click="router.push('/admin')"><ArrowLeft :size="20" /></button>
                <h2 class="header-title">MANAGE USERS</h2>
                <div style="width: 28px"></div>
            </div>

            <div v-if="loading" class="loading">Loading...</div>

            <div v-else class="list-container">
                <p v-if="!users.length" class="empty-text">No users found</p>
                <div v-for="item in users" :key="item.id" class="user-card">
                    <div class="card-info">
                        <span class="username">{{ item.username }}</span>
                        <span class="user-details">{{ item.name }} {{ item.surname }}</span>
                    </div>
                    <button class="delete-button" @click="handleDeleteUser(item.id)">
                        <Trash2 :size="16" /> Delete
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
.back-button {
    background: transparent;
    border: none;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 5px;
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
.user-card {
    width: 100%;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    display: flex;
    align-items: center;
    padding: 15px 20px;
    margin-bottom: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.2s;
}
.user-card:hover {
    background: rgba(255, 255, 255, 0.12);
}
.card-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.username {
    font-size: 1.1rem;
    font-weight: bold;
    color: #fff;
}
.user-details {
    font-size: 0.85rem;
    color: #aaa;
}
.delete-button {
    background: transparent;
    border: 1px solid rgba(255, 107, 107, 0.3);
    color: #ff6b6b;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    font-size: 0.85rem;
    transition: all 0.2s;
    white-space: nowrap;
}
.delete-button:hover {
    background: rgba(255, 107, 107, 0.15);
}
.empty-text {
    color: #888;
    text-align: center;
    margin-top: 50px;
    font-size: 1rem;
}
</style>
