import './assets/css/app.css';
import './assets/css/tailwind.css';
import 'nprogress/nprogress.css';

import { useColorMode } from '@vueuse/core';
import customThemePreset from './theme/noir-preset';

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
const colorMode = useColorMode({ emitAuto: true });

app.provide('colorMode', colorMode)
    .use(pinia)
    .use(router)
    .use(PrimeVue, {
        theme: {
            preset: customThemePreset,
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
