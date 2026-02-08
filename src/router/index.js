import { createRouter, createWebHashHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import SignupView from '../views/SignupView.vue';
import HomeView from '../views/UserView.vue';
import Extra1View from '../views/ActivitiesView.vue';
import Extra2View from '../views/ReservesView.vue';

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/signup', name: 'signup', component: SignupView },
    { path: '/home', name: 'home', component: HomeView },
    { path: '/extra1', name: 'extra1', component: Extra1View },
    { path: '/extra2', name: 'extra2', component: Extra2View },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
