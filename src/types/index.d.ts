import { DataTableFilterMetaData } from 'primevue';
import { MenuItem as PrimeVueMenuItem } from 'primevue/menuitem';
import type { LucideIcon } from 'lucide-vue-next';

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
    route?: string;
    lucideIcon?: LucideIcon;
    lucideIconClass?: string;
    active?: boolean;
}
