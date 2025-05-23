<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import Breadcrumb, { type BreadcrumbPassThroughOptions, type BreadcrumbProps } from 'primevue/breadcrumb';
import { ChevronRight } from 'lucide-vue-next';
import type { ExtendedMenuItem } from '@/types';
import { ptViewMerge } from '@/utils';

interface ExtendedBreadcrumbProps extends Omit<BreadcrumbProps, 'model'> {
    model: ExtendedMenuItem[];
}
const componentProps = defineProps<ExtendedBreadcrumbProps>();

const defaultPt = ref<BreadcrumbPassThroughOptions>({
    root: 'p-0 bg-transparent'
});

type BreadcrumbType = InstanceType<typeof Breadcrumb>;
const childRef = useTemplateRef<BreadcrumbType>('child-ref');
defineExpose({ el: childRef });
</script>

<template>
    <Breadcrumb
        ref="child-ref"
        v-bind="{ ...componentProps, pt: defaultPt, ptOptions: { mergeProps: ptViewMerge } }"
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
