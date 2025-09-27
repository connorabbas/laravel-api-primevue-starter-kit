<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import PageTitleSection from '@/components/PageTitleSection.vue';

const route = useRoute();
const currentRoute = computed(() => route.name);

const sidebarNavItems = computed(() => [
    {
        title: 'Profile',
        route: { name: 'settings.profile.edit' },
        active: currentRoute.value == 'settings.profile.edit',
    },
    {
        title: 'Password',
        route: { name: 'settings.password.edit' },
        active: currentRoute.value == 'settings.password.edit',
    },
    {
        title: 'Appearance',
        route: { name: 'settings.appearance' },
        active: currentRoute.value == 'settings.appearance',
    },
]);
</script>

<template>
    <div>
        <PageTitleSection>
            <template #title>
                Settings
            </template>
            <template #subTitle>
                Manage your profile and account settings
            </template>
        </PageTitleSection>

        <Divider class="my-8" />

        <div class="flex flex-col gap-6 lg:gap-8 lg:flex-row">
            <aside class="w-full md:max-w-2xl lg:w-48">
                <nav class="flex flex-col space-x-0 space-y-1">
                    <RouterLink
                        v-for="item in sidebarNavItems"
                        :key="item.route"
                        :to="item.route"
                        class="no-underline!"
                    >
                        <Button
                            pt:root:class="flex items-center justify-start"
                            :severity="item.active ? 'secondary' : ''"
                            :variant="item.active ? 'outlined' : 'text'"
                            :href="item.route"
                            fluid
                        >
                            {{ item.title }}
                        </Button>
                    </RouterLink>
                </nav>
            </aside>

            <section class="flex-1 md:max-w-2xl">
                <slot />
            </section>
        </div>
    </div>
</template>
