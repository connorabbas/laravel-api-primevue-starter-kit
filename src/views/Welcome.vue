<script setup lang="ts">
import Container from '@/components/Container.vue';
import { useAuthStore } from '@/stores/auth';
import { LayoutGrid, LogIn, Settings, UserPlus } from 'lucide-vue-next';

const authStore = useAuthStore();
await authStore.fetchUser();
</script>

<template>
    <Container fluid>
        <div class="min-h-svh flex items-center justify-center">
            <Card pt:body:class="p-4 py-6 sm:p-12">
                <template #content>
                    <div class="text-center md:text-left">
                        <section>
                            <span class="block text-6xl font-bold text-red-500 dark:text-red-400 mb-1">Laravel API</span>
                            <div class="text-6xl text-primary font-bold text-green-500 dark:text-green-400 mb-4">
                                + PrimeVue
                            </div>
                            <p class="mt-0 mb-2 text-muted-color leading-normal">
                                A starter kit for using
                                <a
                                    href="https://github.com/laravel/breeze"
                                    class="underline text-primary hover:text-color"
                                >Laravel Breeze</a> API stack authentication,
                            </p>
                            <p class="mt-0 mb-6 text-muted-color leading-normal">
                                utilizing
                                <a
                                    href="https://primevue.org/"
                                    class="underline text-primary hover:text-color"
                                >PrimeVue</a>
                                components in a basic SPA
                            </p>
                            <template v-if="authStore?.user">
                                <RouterLink :to="{ name: 'dashboard' }">
                                    <Button
                                        label="Dashboard"
                                        class="mr-4"
                                    >
                                        <template #icon>
                                            <LayoutGrid />
                                        </template>
                                    </Button>
                                </RouterLink>
                                <RouterLink :to="{ name: 'settings.profile.edit' }">
                                    <Button
                                        outlined
                                        label="Profile Settings"
                                        class="mr-4"
                                    >
                                        <template #icon>
                                            <Settings />
                                        </template>
                                    </Button>
                                </RouterLink>
                            </template>
                            <template v-else>
                                <RouterLink :to="{ name: 'login' }">
                                    <Button
                                        label="Login"
                                        class="mr-4"
                                    >
                                        <template #icon>
                                            <LogIn />
                                        </template>
                                    </Button>
                                </RouterLink>
                                <RouterLink :to="{ name: 'register' }">
                                    <Button
                                        outlined
                                        label="Register"
                                        class="mr-4"
                                    >
                                        <template #icon>
                                            <UserPlus />
                                        </template>
                                    </Button>
                                </RouterLink>
                            </template>
                        </section>
                    </div>
                </template>
            </Card>
        </div>
    </COntainer>
</template>
