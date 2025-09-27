import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import progress from '@/utils/progress';
import authRoutes from './auth';
import webRoutes from './web';
import { Middleware, MiddlewareContext } from '@/types';

// Extend route meta to include middleware
declare module 'vue-router' {
    interface RouteMeta {
        middleware?: Middleware[];
    }
}

const routes: RouteRecordRaw[] = [
    ...authRoutes as RouteRecordRaw[],
    ...webRoutes as RouteRecordRaw[],
    {
        path: '/:pathMatch(.*)*', // 404 route not found
        name: 'NotFound',
        component: () => import('@/views/error/NotFound.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_BASE_PATH ?? '/'),
    routes,
});

let progressTimeout: ReturnType<typeof setTimeout> | null = null;

router.beforeEach(async (to, from) => {
    progressTimeout = setTimeout(() => progress.start(), 250);
    const authStore = useAuthStore();

    try {
        const context: MiddlewareContext = { to, from, authStore };
        const routeMiddleware = to.meta.middleware ?? [];

        for (const middleware of routeMiddleware) {
            const result = await middleware(context);
            if (result) {
                return result; // Redirect or block navigation
            }
        }
    } finally {
        if (progressTimeout) {
            clearTimeout(progressTimeout);
        }
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
