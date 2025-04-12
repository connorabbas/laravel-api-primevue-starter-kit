<script setup lang="ts">
import { useTemplateRef } from 'vue';
import Breadcrumb from 'primevue/breadcrumb';
import { ChevronRight } from 'lucide-vue-next';
import type { ExtendedMenuItem } from '@/types';

const componentProps = defineProps<{
    model: ExtendedMenuItem[]
}>();

type BreadcrumbType = InstanceType<typeof Breadcrumb>;
const childRef = useTemplateRef<BreadcrumbType>('child-ref');
defineExpose({
    childRef,
});
</script>

<template>
    <Breadcrumb
        ref="child-ref"
        :model="componentProps.model"
        pt:root:class="p-0 bg-transparent"
    >
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
                    class="p-breadcrumb-item-link"
                    @click="navigate"
                >
                    <i
                        v-if="item.icon"
                        :class="item.icon"
                        class="p-breadcrumb-item-icon"
                    />
                    <component
                        :is="item.lucideIcon"
                        v-else-if="item.lucideIcon"
                        class="p-breadcrumb-item-icon"
                    />
                    <span class="p-breadcrumb-item-label">{{ item.label }}</span>
                </a>
            </RouterLink>
            <a
                v-else
                :href="item.url"
                :target="item.target"
                v-bind="props.action"
            >
                <i
                    v-if="item.icon"
                    :class="item.icon"
                    class="p-breadcrumb-item-icon"
                />
                <component
                    :is="item.lucideIcon"
                    v-else-if="item.lucideIcon"
                    class="p-breadcrumb-item-icon"
                />
                <span class="p-breadcrumb-item-label">{{ item.label }}</span>
            </a>
        </template>
        <template #separator>
            <ChevronRight />
        </template>
    </Breadcrumb>
</template>
