import auth from '@/middleware/auth';
import guest from '@/middleware/guest';

const authRoutes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/auth/Login.vue'),
        meta: { middleware: [guest] },
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/auth/Register.vue'),
        meta: { middleware: [guest] },
    },
    {
        path: '/forgot-password',
        name: 'forgotPassword',
        component: () => import('@/views/auth/ForgotPassword.vue'),
        meta: { middleware: [guest] },
    },
    {
        path: '/password-reset/:token',
        name: 'passwordReset',
        component: () => import('@/views/auth/ResetPassword.vue'),
        props: true,
        meta: { middleware: [guest] },
    },
    {
        path: '/verify-email',
        name: 'verifyEmail',
        component: () => import('@/views/auth/VerifyEmail.vue'),
        meta: { middleware: [auth] },
    },
];

export default authRoutes;
