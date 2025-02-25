<script setup lang="ts">
import { useTemplateRef } from 'vue';
import Menu from 'primevue/menu';

type MenuType = InstanceType<typeof Menu>
const childRef = useTemplateRef<MenuType>('child-ref');
defineExpose({
    childRef,
});
</script>

<template>
    <Menu ref="child-ref">
        <template #item="{ item, props }">
            <RouterLink
                v-if="item.route"
                v-slot="{ href, navigate }"
                :to="item.route"
                custom
            >
                <a
                    :href="href"
                    v-bind="props.action"
                    class="p-menu-item-link"
                    @click="navigate"
                >
                    <span
                        v-if="item.icon"
                        :class="item.icon"
                        class="p-menu-item-icon"
                    />
                    <span class="p-menu-item-label">{{ item.label }}</span>
                </a>
            </RouterLink>
            <a
                v-else
                :href="item.url"
                :target="item.target"
                v-bind="props.action"
            >
                <span
                    v-if="item.icon"
                    :class="item.icon"
                    class="p-menu-item-icon"
                />
                <span class="p-menu-item-label">{{ item.label }}</span>
            </a>
        </template>
    </Menu>
</template>
