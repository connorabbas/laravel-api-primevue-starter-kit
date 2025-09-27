<script setup lang="ts">
import ApplicationLogo from '@/components/ApplicationLogo.vue';
</script>

<template>
    <Button
        asChild
        variant="link"
    >
        <RouterLink
            :to="{ name: 'welcome' }"
            class="flex items-center justify-start gap-4 no-underline! p-0"
        >
            <ApplicationLogo class="block h-8 lg:h-10 w-auto fill-current text-surface-900 dark:text-surface-0" />
            <span class="font-bold text-surface-900 dark:text-surface-0">Laravel + PrimeVue Starter Kit</span>
        </RouterLink>
    </Button>
</template>
