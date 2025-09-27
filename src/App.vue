<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
    <!-- Use key to re-generate the page view component on each navigation :key="$route.path" -->
    <!-- Alteratively, use a watch() on each component to re-render dynamic data as needed -->
    <Toast position="bottom-right" />
    <RouterView v-slot="{ Component }">
        <Suspense timeout="0">
            <template #default>
                <component :is="Component" />
            </template>
            <template #fallback>
                <div class="h-screen flex items-center justify-center">
                    <ProgressSpinner />
                </div>
            </template>
        </Suspense>
    </RouterView>
</template>
