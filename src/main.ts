import '@/assets/css/app.css'
import '@/assets/css/tailwind.css'
import 'nprogress/nprogress.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import Tooltip from 'primevue/tooltip'

import { useColorMode } from '@vueuse/core'
import themePreset from '@/theme/noir-preset'
import globalPt from '@/theme/global-pt'

import App from '@/App.vue'
import router from './router'

const colorMode = useColorMode({ emitAuto: true })
const app = createApp(App)

app.provide('colorMode', colorMode)
app.directive('tooltip', Tooltip)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: themePreset,
        options: {
            darkModeSelector: '.dark',
            cssLayer: {
                name: 'primevue',
                order: 'theme, base, primevue, utilities',
            },
        },
    },
    pt: globalPt,
})
app.use(ConfirmationService)
app.use(ToastService)

app.mount('#app')
