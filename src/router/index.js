import { createRouter, createWebHashHistory } from 'vue-router';

// VISTAS DE AUTENTICACIÓN
import LoginView from '../views/auth/LoginView.vue';
import SignupView from '../views/auth/SignupView.vue';

// VISTAS DE USUARIO
import UserDashboardView from '../views/user/DashboardView.vue';
import UserActivitiesView from '../views/user/ActivitiesView.vue';
import UserReservesView from '../views/user/ReservesView.vue';
import ProfileView from '../views/user/ProfileView.vue';

// VISTAS DE ADMIN
import AdminDashboardView from '../views/admin/DashboardView.vue';
import AdminActivitiesView from '../views/admin/ActivitiesView.vue';
import AdminReservesView from '../views/admin/ReservesView.vue';
import AdminUsersView from '../views/admin/UsersView.vue';

const routes = [

    // RUTAS DE AUTENTICACIÓN
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/signup', name: 'signup', component: SignupView },

    // RUTAS DE USUARIO
    { path: '/user', name: 'user', component: UserDashboardView },
    { path: '/user/activities', name: 'user-activities', component: UserActivitiesView },
    { path: '/user/reserves', name: 'user-reserves', component: UserReservesView },
    { path: '/user/profile', name: 'user-profile', component: ProfileView },

    // RUTAS DE ADMIN
    { path: '/admin', name: 'admin', component: AdminDashboardView },
    { path: '/admin/activities', name: 'admin-activities', component: AdminActivitiesView },
    { path: '/admin/reserves', name: 'admin-reserves', component: AdminReservesView },
    { path: '/admin/users', name: 'admin-users', component: AdminUsersView },
];

// CREAR EL ROUTER
const router = createRouter({
    history: createWebHashHistory(), // CONFIGURAR HISTORIA DE NAVEGACIÓN
    routes, // ASIGNAR LAS RUTAS
});

export default router;
