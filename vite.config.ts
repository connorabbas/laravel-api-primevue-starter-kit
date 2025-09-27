import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
//import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from "@tailwindcss/vite";

import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // https://vite.dev/config/#using-environment-variables-in-config
    const env = loadEnv(mode, process.cwd(), '');
    const devPort = env.VITE_APP_PORT ? Number(env.VITE_APP_PORT) : 5173;

    return {
        plugins: [
            vue(),
            //vueDevTools(),
            tailwindcss(),
            Components({
                resolvers: [
                    PrimeVueResolver()
                ]
            })
        ],
        base: env.VITE_BASE_PATH || '/',
        define: {
            // Provide an explicit app-level constant derived from an env var.
            __APP_ENV__: JSON.stringify(env.APP_ENV),
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        server: {
            host: true,
            port: devPort,
            watch: {
                usePolling: true,
            },
        },
        preview: {
            port: devPort,
        },
    };
});
