import { createRouter, createWebHashHistory } from 'vue-router';

// Auth views
import LoginView from '../views/auth/LoginView.vue';
import SignupView from '../views/auth/SignupView.vue';

// User views
import UserDashboardView from '../views/user/DashboardView.vue';
import UserActivitiesView from '../views/user/ActivitiesView.vue';
import UserReservesView from '../views/user/ReservesView.vue';
import ProfileView from '../views/user/ProfileView.vue';

// Admin views
import AdminDashboardView from '../views/admin/DashboardView.vue';
import AdminActivitiesView from '../views/admin/ActivitiesView.vue';
import AdminReservesView from '../views/admin/ReservesView.vue';
import AdminUsersView from '../views/admin/UsersView.vue';

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/signup', name: 'signup', component: SignupView },

    // User routes
    { path: '/user', name: 'user', component: UserDashboardView },
    { path: '/user/activities', name: 'user-activities', component: UserActivitiesView },
    { path: '/user/reserves', name: 'user-reserves', component: UserReservesView },
    { path: '/user/profile', name: 'user-profile', component: ProfileView },

    // Admin routes
    { path: '/admin', name: 'admin', component: AdminDashboardView },
    { path: '/admin/activities', name: 'admin-activities', component: AdminActivitiesView },
    { path: '/admin/reserves', name: 'admin-reserves', component: AdminReservesView },
    { path: '/admin/users', name: 'admin-users', component: AdminUsersView },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
