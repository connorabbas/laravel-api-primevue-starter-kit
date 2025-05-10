import './assets/css/app.css';
import './assets/css/tailwind.css';
import 'nprogress/nprogress.css';

import { useColorMode } from '@vueuse/core';
import { useThemePreset } from '@/composables/useThemePreset';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import router from './router';

import App from './App.vue';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

import Container from '@/components/Container.vue';
import PageTitleSection from '@/components/PageTitleSection.vue';

const app = createApp(App);
const pinia = createPinia();

// Site light/dark mode
const colorMode = useColorMode({ emitAuto: true });

// Site theme preset
const { getCurrentPreset } = useThemePreset();
const themePreset = getCurrentPreset();

app.provide('colorMode', colorMode)
    .use(pinia)
    .use(router)
    .use(PrimeVue, {
        theme: {
            preset: themePreset,
            options: {
                darkModeSelector: '.dark',
                cssLayer: {
                    name: 'primevue',
                    order: 'tailwind-theme, tailwind-base, primevue, tailwind-utilities',
                },
            },
        },
    })
    .use(ToastService)
    .component('Container', Container)
    .component('PageTitleSection', PageTitleSection)
    .mount('#app');
