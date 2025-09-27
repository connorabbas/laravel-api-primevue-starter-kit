<script setup lang="ts">
import ApplicationLogo from '@/components/ApplicationLogo.vue';
</script>

<template>
    <Button
        v-slot="slotProps"
        asChild
        variant="link"
    >
        <RouterLink
            :to="{ name: 'welcome' }"
            :class="slotProps.class"
            class="flex items-center justify-start gap-4 no-underline! p-0"
        >
            <ApplicationLogo class="block h-8 lg:h-10 w-auto fill-current text-surface-900 dark:text-surface-0" />
            <span class="font-bold">Laravel + PrimeVue Starter Kit</span>
        </RouterLink>
    </Button>
</template>
