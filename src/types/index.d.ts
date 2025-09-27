import { DataTableFilterMetaData } from 'primevue'
import { MenuItem as PrimeVueMenuItem } from 'primevue/menuitem'
import type { LucideIcon } from 'lucide-vue-next'
import { RouteLocationNormalizedGeneric, RouteLocationRaw } from 'vue-router'

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PrimeVueDataFilters = {
    [key: string]: DataTableFilterMetaData;
};

export interface MenuItem extends PrimeVueMenuItem {
    route?: RouteLocationRaw | string;
    lucideIcon?: LucideIcon;
    lucideIconClass?: string;
    active?: boolean;
}

export interface MiddlewareContext {
    to: RouteLocationNormalizedGeneric;
    from: RouteLocationNormalizedGeneric;
    authStore: ReturnType<typeof useAuthStore>;
}

export type Middleware = (
    context: MiddlewareContext
) => Promise<
    | void
    | false
    | string
    | RouteLocationRaw
>;
