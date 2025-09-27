<script setup lang="ts">
import AppLayout from '@/layouts/app/SidebarLayout.vue';
import { type MenuItem } from '@/types';

const props = withDefaults(defineProps<{
    breadcrumbs?: MenuItem[],
}>(), {
    breadcrumbs: () => [],
});
</script>

<template>
    <AppLayout :breadcrumbs="props.breadcrumbs">
        <slot />
    </AppLayout>
</template>
