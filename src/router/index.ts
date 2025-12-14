import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MapView from '../views/MapView.vue'
import ZoneView from '../views/ZoneView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/map',
            name: 'map',
            component: MapView
        },
        {
            path: '/zone/:id',
            name: 'zone',
            component: ZoneView
        }
    ]
})

export default router
