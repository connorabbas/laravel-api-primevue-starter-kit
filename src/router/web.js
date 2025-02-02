import auth from '@/middleware/auth';
import verified from '@/middleware/verified';

const webRoutes = [
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
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/profile/Edit.vue'),
        meta: { middleware: [auth] },
    },
    {
        path: '/users',
        name: 'users',
        component: () => import('@/views/Users.vue'),
        meta: { middleware: [auth] },
    },
];

export default webRoutes;
