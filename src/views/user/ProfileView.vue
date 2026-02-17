<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getUserById, updatePassword } from '@/services/user/userService';
import { userSession } from '@/services/auth/session';

const router = useRouter();
const user = ref<any>(null);
const loading = ref(true);
const modalVisible = ref(false);
const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const updating = ref(false);
const error = ref('');
const successMsg = ref('');

onMounted(async () => {
    try {
        loading.value = true;
        const data = await getUserById(userSession.userId);
        user.value = data;
    } catch (e: any) {
        error.value = e.message || 'Could not load profile';
    } finally {
        loading.value = false;
    }
});

const handleChangePassword = async () => {
    if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
        error.value = 'Please fill in all fields';
        return;
    }
    if (newPassword.value !== confirmPassword.value) {
        error.value = 'New passwords do not match';
        return;
    }

    try {
        updating.value = true;
        error.value = '';
        await updatePassword(userSession.userId, oldPassword.value, newPassword.value);
        successMsg.value = 'Password updated successfully';
        modalVisible.value = false;
        oldPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
    } catch (e: any) {
        error.value = e.message || 'Error updating password';
    } finally {
        updating.value = false;
    }
};

const closeModal = () => {
    modalVisible.value = false;
    error.value = '';
    oldPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
};
</script>

<template>
    <main>
        <div class="overlay">
            <div class="header">
                <button class="back-button" @click="router.push('/user')">← </button>
                <h2 class="header-title">MY PROFILE</h2>
                <div style="width: 28px"></div>
            </div>

            <div v-if="loading" class="loading">Loading...</div>

            <div v-else class="scroll-container">
                <div class="profile-header">
                    <div class="avatar-circle">👤</div>
                    <h2 class="user-name">{{ user?.name }} {{ user?.surname }}</h2>
                    <p class="user-role">@{{ user?.username }}</p>
                </div>

                <div class="info-section">
                    <div class="info-row">
                        <span class="info-icon">📧</span>
                        <div class="info-text">
                            <span class="info-label">Username / Email</span>
                            <span class="info-value">{{ user?.username }}</span>
                        </div>
                    </div>
                    <div class="info-row">
                        <span class="info-icon">📋</span>
                        <div class="info-text">
                            <span class="info-label">Total Reserves</span>
                            <span class="info-value">{{ user?.totalReserves || 0 }}</span>
                        </div>
                    </div>
                </div>

                <p v-if="successMsg" class="success-text">{{ successMsg }}</p>

                <button class="change-password-btn" @click="modalVisible = true">
                    🔒 Change password
                </button>
            </div>
        </div>

        <!-- Modal cambio de contraseña -->
        <div v-if="modalVisible" class="modal-overlay" @click.self="closeModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Change password</h3>
                    <button class="close-btn" @click="closeModal">✕</button>
                </div>

                <p v-if="error" class="error-text">{{ error }}</p>

                <label class="input-label">Current password</label>
                <input type="password" v-model="oldPassword" placeholder="Current password" class="modal-input" />

                <label class="input-label">New password</label>
                <input type="password" v-model="newPassword" placeholder="New password (min 6 chars)" class="modal-input" />

                <label class="input-label">Confirm new password</label>
                <input type="password" v-model="confirmPassword" placeholder="Confirm new password" class="modal-input" />

                <button class="submit-btn" @click="handleChangePassword" :disabled="updating">
                    {{ updating ? 'Updating...' : 'Update password' }}
                </button>
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
    background: rgba(0,0,0,0.8);
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
    max-width: 600px;
    margin-bottom: 30px;
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
    font-size: 1.2rem;
    font-weight: bold;
    color: #fff;
    letter-spacing: 1.5px;
}
.loading {
    color: #F7B176;
    font-size: 1.2rem;
    margin-top: 50px;
}
.scroll-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    overflow-y: auto;
    padding-bottom: 40px;
}
.profile-header {
    text-align: center;
    margin-bottom: 40px;
}
.avatar-circle {
    width: 120px;
    height: 120px;
    border-radius: 60px;
    background: rgba(247, 177, 118, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 4rem;
    border: 2px solid #F7B176;
    margin: 0 auto 15px auto;
}
.user-name {
    font-size: 1.5rem;
    font-weight: bold;
    color: #fff;
}
.user-role {
    font-size: 0.9rem;
    color: #F7B176;
    margin-top: 5px;
    text-transform: uppercase;
    letter-spacing: 1px;
}
.info-section {
    width: 90%;
    max-width: 500px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 30px;
}
.info-row {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}
.info-row:last-child {
    margin-bottom: 0;
}
.info-icon {
    font-size: 1.5rem;
    margin-right: 15px;
}
.info-text {
    display: flex;
    flex-direction: column;
}
.info-label {
    font-size: 0.75rem;
    color: #888;
    margin-bottom: 2px;
}
.info-value {
    font-size: 1rem;
    color: #fff;
    font-weight: 500;
}
.change-password-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(247, 177, 118, 0.2);
    padding: 15px 30px;
    border-radius: 12px;
    border: 1px solid #F7B176;
    color: #fff;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
}
.change-password-btn:hover {
    background: rgba(247, 177, 118, 0.35);
}
.success-text {
    color: #4caf50;
    font-weight: bold;
    margin-bottom: 15px;
}
.error-text {
    color: #ff6b6b;
    font-weight: bold;
    margin-bottom: 10px;
}

/* Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
.modal-content {
    width: 90%;
    max-width: 450px;
    background: #1e1e1e;
    border-radius: 20px;
    padding: 25px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
}
.modal-header h3 {
    font-size: 1.3rem;
    font-weight: bold;
    color: #fff;
}
.close-btn {
    background: transparent;
    border: none;
    color: #fff;
    font-size: 1.3rem;
    cursor: pointer;
}
.input-label {
    color: #F7B176;
    font-size: 0.85rem;
    margin-bottom: 8px;
    margin-left: 5px;
    display: block;
}
.modal-input {
    width: 100%;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    padding: 12px;
    color: #fff;
    margin-bottom: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 0.95rem;
    box-sizing: border-box;
}
.modal-input::placeholder {
    color: #666;
}
.submit-btn {
    width: 100%;
    background: #F7B176;
    padding: 15px;
    border-radius: 10px;
    border: none;
    color: #000;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    margin-top: 10px;
    transition: opacity 0.3s;
}
.submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
.submit-btn:hover:not(:disabled) {
    opacity: 0.9;
}
</style>
