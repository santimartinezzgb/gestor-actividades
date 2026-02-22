<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, Trash2 } from 'lucide-vue-next';
import { getUsers, deleteUser } from '@/services/user/userService';

const router = useRouter();
const users = ref<any[]>([]);
const loading = ref(true);
const search = ref('');

const filteredUsers = computed(() =>
    users.value.filter(u =>
        u.username.toLowerCase().includes(search.value.toLowerCase())
    )
);

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
        <div class="main">
            <div class="header">
                <button class="backButton" @click="router.push('/admin')"><ArrowLeft :size="20" /></button>
                <h2 class="title">MANAGE USERS</h2>
                <div style="width: 28px"></div>
            </div>

            <div class="statsBar">
                <h2 :class="['userLength', { zero: filteredUsers.length === 0 }]">{{ filteredUsers.length }} user{{ filteredUsers.length !== 1 ? 's' : '' }}</h2>
                <input
                    v-model="search"
                    class="searchInput"
                    type="text"
                    placeholder="Search by username..."
                />
            </div>

            <div v-if="loading" class="loading">Loading...</div>

            <div v-else class="listContainer">
                <p v-if="!filteredUsers.length" class="usersNotFound">No users found</p>
                <div v-for="item in filteredUsers" :key="item.id" class="userCard">
                    <div class="cardInfo">
                        <span class="username">{{ item.username }}</span>
                    </div>
                    <button class="deleteButton" @click="handleDeleteUser(item.id)">
                        <Trash2 :size="16" />
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
    background-color: transparent;
}
.main {
    width: 100%;
    height: 100%;
    padding: 2rem;
    background: #000000B2;
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
.backButton {
    background: transparent;
    border: none;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 5px;
}
.title {
    font-size: 1.3rem;
    font-weight: bold;
    color: #fff;
    letter-spacing: 1px;
}


/* CONTADOR DE USUARIOS Y BARRA DE BÚSQUEDA */
.statsBar {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 50%;
    margin: 2rem 0;
}

.userLength {
    color: #fff;
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
    background-color: #FFFFFF14;
    padding: 10px 20px;
    border-radius: 8px;
    border: 1px solid #FFFFFF1A;
    white-space: nowrap;
    margin: 0;
}

.userLength.zero {
    color: #ff6b6b;
    border-color: #FF6B6B4C;
    background-color: #FF6B6B14;
}

.searchInput {
    flex: 1;
    background: #FFFFFF14;
    border: 1px solid #FFFFFF1A;
    border-radius: 8px;
    padding: 10px 16px;
    color: #fff;
    font-size: 1rem;
    outline: none;
    transition: border 0.2s;
}

.searchInput:focus {
    border-color: #F7B176;
}

.loading {
    color: #F7B176;
    font-size: 1.2rem;
    margin-top: 50px;
}

/* LISTA DE USUARIOS */
.listContainer {
    width: 50%;
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px;
}
.userCard {
    width: 100%;
    background: #FFFFFF14;
    border-radius: 12px;
    display: flex;
    align-items: center;
    padding: 15px 20px;
    margin-bottom: 12px;
    border: 1px solid #FFFFFF1A;
    transition: all 0.2s;
}
.userCard:hover {
    background: #FFFFFF1F;
}
.cardInfo {
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
.deleteButton {
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border: 1px solid #FF6B6B4C;
    color: #ff6b6b;
    padding: 8px 8px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    font-size: 0.85rem;
    transition: all 0.2s;
    white-space: nowrap;
}
.deleteButton:hover {
    background: #FF6B6B26;
}
.usersNotFound {
    color: #888;
    text-align: center;
    margin-top: 50px;
    font-size: 1rem;
}
</style>
