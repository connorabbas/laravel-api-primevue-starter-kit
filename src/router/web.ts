import type { RouteRecordRaw } from 'vue-router'
import auth from '@/middleware/auth'
import verified from '@/middleware/verified'

const webRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'welcome',
        component: () => import('@/views/Welcome.vue'),
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { middleware: [auth, verified] },
    },
    {
        path: '/settings/profile',
        name: 'settings.profile.edit',
        component: () => import('@/views/settings/Profile.vue'),
        meta: { middleware: [auth] },
    },
    {
        path: '/settings/password',
        name: 'settings.password.edit',
        component: () => import('@/views/settings/Password.vue'),
        meta: { middleware: [auth] },
    },
    {
        path: '/settings/appearance',
        name: 'settings.appearance',
        component: () => import('@/views/settings/Appearance.vue'),
        meta: { middleware: [auth] },
    },
]

export default webRoutes
