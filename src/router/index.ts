import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import progress from '@/utils/progress';
import authRoutes from './auth';
import webRoutes from './web';

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_BASE_PATH ?? '/'),
    routes: [
        ...authRoutes,
        ...webRoutes,
        {
            path: '/:pathMatch(.*)*', // 404 route not found
            name: 'NotFound',
            component: () => import('@/views/error/NotFound.vue'),
        },
    ],
});

let progressTimeout = null;
router.beforeEach(async (to, from) => {
    progressTimeout = setTimeout(() => progress.start(), 250);
    const authStore = useAuthStore();

    // Run middleware pipeline
    try {
        const context = { to, from, authStore };
        const routeMiddleware = to.meta.middleware || [];
        for (const middleware of routeMiddleware) {
            const result = await middleware(context);
            if (result) {
                return result; // Exit and redirect if middleware returns a route
            }
        }
    } finally {
        clearTimeout(progressTimeout);
        if (progress.isStarted()) {
            progress.done();
        }
    }
});

router.afterEach(() => {
    if (progress.isStarted()) {
        progress.done();
    }
});

export default router;
