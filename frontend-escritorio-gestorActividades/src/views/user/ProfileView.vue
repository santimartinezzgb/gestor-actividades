<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, CircleUser, Mail, ClipboardList, Lock, X } from 'lucide-vue-next';
import { getUserById, updatePassword } from '@/services/user/userService';
import { userSession } from '@/services/auth/session';

const router = useRouter();
const user = ref<any>(null); // GUARDA LOS DATOS DEL USUARIO
const loading = ref(true); // ESTADO DE CARGA

// CONTROLADORES PARA EL MODAL DE CAMBIO DE CONTRASEÑA
const modalVisible = ref(false); // VISIBILIDAD DEL MODAL
const oldPassword = ref(''); // CONTRASEÑA ACTUAL
const newPassword = ref(''); // NUEVA CONTRASEÑA
const confirmPassword = ref(''); // CONFIRMACIÓN
const updating = ref(false); // ESTADO DE ACTUALIZACIÓN
const error = ref(''); // MENSAJE DE ERROR
const successMsg = ref(''); // MENSAJE DE ÉXITO

// CARGAR DATOS DEL USUARIO AL MONTAR EL COMPONENTE
onMounted(async () => {
    try {
        loading.value = true;
        const data = await getUserById(userSession.userId);
        user.value = data;
    } catch (e: any) {
        error.value = e.message;
    } finally {
        loading.value = false;
    }
});

// MANEJAR CAMBIO DE CONTRASEÑA
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
        // ACTUALIZAR CONTRASEÑA
        updating.value = true;
        error.value = '';
        await updatePassword(userSession.userId, oldPassword.value, newPassword.value);
        successMsg.value = 'Password updated successfully';
        modalVisible.value = false;
        oldPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
    } catch (e: any) {
        error.value = e.message;
    } finally {
        updating.value = false;
    }
};

// CERRAR MODAL Y RESETEAR ESTADOS
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
        <div class="main">
            <div class="header">
                <button class="backButton" @click="router.push('/user')"><ArrowLeft :size="20" /></button>
            </div>

            <div v-if="loading" class="loading">Loading...</div>

            <div v-else class="scrollContainer">
                <div class="profileHeader">
                    <div class="avatarCircle"><CircleUser :size="64" color="#F7B176" /></div>
                    <h2 class="userName">{{ user?.name }} {{ user?.surname }}</h2>
                    <p class="userRole">@{{ user?.username }}</p>
                </div>

                <div class="infoSection">
                    <div class="infoRow">
                        <span class="infoIcon"><Mail :size="24" color="#F7B176" /></span>
                        <div class="infoText">
                            <span class="infoLabel">Username</span>
                            <span class="infoValue">{{ user?.username }}</span>
                        </div>
                    </div>
                    <div class="infoRow">
                        <span class="infoIcon"><ClipboardList :size="24" color="#F7B176" /></span>
                        <div class="infoText">
                            <span class="infoLabel">Total Reserves</span>
                            <span class="infoValue">{{ user?.totalReserves || 0 }}</span>
                        </div>
                    </div>
                </div>

                <p v-if="successMsg" class="successText">{{ successMsg }}</p>

                <button class="changePasswordBtn" @click="modalVisible = true">
                    <Lock :size="18" /> Change password
                </button>
            </div>
        </div>

        <!-- MODAL DE CAMBIO DE CONTRASEÑA -->
        <div v-if="modalVisible" class="modalmain" @click.self="closeModal">
            <div class="modalContent">
                <div class="modalHeader">
                    <h3>Change password</h3>
                    <button class="closeBtn" @click="closeModal"><X :size="18" /></button>
                </div>

                <p v-if="error" class="errorText">{{ error }}</p>

                <input type="password" v-model="oldPassword" placeholder="Current password" class="modalInput" />

                <input type="password" v-model="newPassword" placeholder="New password (min 6 chars)" class="modalInput" />

                <input type="password" v-model="confirmPassword" placeholder="Confirm new password" class="modalInput" />

                <button class="submitBtn" @click="handleChangePassword" :disabled="updating">
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
    background-color: transparent;
    position: relative;
}
.main {
    width: 100%;
    height: 100%;
    padding: 60px 2rem 2rem;
    background: #000000CC;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.header {
    display: flex;
    align-items: center;
    width: 90%;
    max-width: 600px;
    margin-bottom: 30px;
}
.backButton {
    background: transparent;
    border: none;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 5px;
}
.loading {
    color: #F7B176;
    font-size: 1.2rem;
    margin-top: 50px;
}
.scrollContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    overflow-y: auto;
    padding-bottom: 40px;
}
.profileHeader {
    text-align: center;
    margin-bottom: 40px;
}
.avatarCircle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: #F7B1761A;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 4rem;
    border: 2px solid #F7B176;
    margin: 0 auto 15px;
}
.userName {
    font-size: 1.5rem;
    font-weight: bold;
    color: #fff;
}
.userRole {
    font-size: 1rem;
    color: #F7B176;
    margin-top: 5px;
    text-transform: uppercase;
    letter-spacing: 3px;
}
.infoSection {
    width: 100%;
    max-width: 500px;
    background: #FFFFFF0D;
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 30px;
}
.infoRow {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}
.infoRow:last-child {
    margin-bottom: 0;
}
.infoIcon {
    font-size: 2rem;
    margin-right: 15px;
}
.infoText {
    display: flex;
    flex-direction: column;
}
.infoLabel {
    font-size: 0.75rem;
    color: #888;
    margin-bottom: 2px;
}
.infoValue {
    font-size: 1rem;
    color: #fff;
    font-weight: 500;
}
.changePasswordBtn {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #F7B17633;
    padding: 15px 30px;
    border-radius: 12px;
    border: 1px solid #F7B176;
    color: #fff;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
}
.changePasswordBtn:hover {
    background: #F7B17659;
}
.successText {
    color: #4caf50;
    font-weight: bold;
    margin-bottom: 15px;
}
.errorText {
    color: #ff6b6b;
    font-weight: bold;
    margin-bottom: 10px;
}

/* Modal */
.modalmain {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #000000E6;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
.modalContent {
    width: 90%;
    max-width: 450px;
    background: #1e1e1e;
    border-radius: 20px;
    padding: 25px;
    border: 1px solid #FFFFFF1A;
}
.modalHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
}
.modalHeader h3 {
    font-size: 1.3rem;
    font-weight: bold;
    color: #fff;
}
.closeBtn {
    background: transparent;
    border: none;
    color: #fff;
    font-size: 1.3rem;
    cursor: pointer;
}
.inputLabel {
    color: #F7B176;
    font-size: 0.85rem;
    margin-bottom: 8px;
    margin-left: 5px;
    display: block;
}
.modalInput {
    width: 100%;
    background: #FFFFFF0D;
    border-radius: 10px;
    padding: 12px;
    color: #fff;
    margin-bottom: 20px;
    border: 1px solid #FFFFFF1A;
    font-size: 0.95rem;
    box-sizing: border-box;
}
.modalInput::placeholder {
    color: #666;
}
.submitBtn {
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
.submitBtn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
.submitBtn:hover:not(:disabled) {
    opacity: 0.9;
}
</style>
