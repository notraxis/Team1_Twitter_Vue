import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router';
import Login from "../views/login.vue";
import Home from "../views/home.vue";
import Register from "../views/register.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '',
        name: 'default',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/home',
        name: 'Zuhause',
        component: Home
    },
    {
        path: '/register',
        name: 'Registrieren',
        component: Register
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router