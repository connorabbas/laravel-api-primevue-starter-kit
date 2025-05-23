<script setup lang="ts">
import { useTemplateRef } from 'vue';
import Menu, { type MenuProps } from 'primevue/menu';
import type { ExtendedMenuItem } from '@/types';
import { ptViewMerge } from '@/utils';

interface ExtendedMenuProps extends Omit<MenuProps, 'model'> {
    model: ExtendedMenuItem[];
}
const componentProps = defineProps<ExtendedMenuProps>();

type MenuType = InstanceType<typeof Menu>;
const childRef = useTemplateRef<MenuType>('child-ref');

defineExpose({
    el: childRef,
    toggle: (event: Event) => childRef.value?.toggle(event)
});
</script>

<template>
    <Menu
        ref="child-ref"
        v-bind="{ ...componentProps, ptOptions: { mergeProps: ptViewMerge } }"
    >
        <template
            v-for="(_, slotName) in $slots"
            #[slotName]="slotProps"
        >
            <slot
                v-if="slotName != 'item'"
                :name="slotName"
                v-bind="slotProps ?? {}"
            />
        </template>
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
                    <i
                        v-if="item.icon"
                        :class="item.icon"
                        class="p-menu-item-icon"
                    />
                    <component
                        :is="item.lucideIcon"
                        v-else-if="item.lucideIcon"
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
                <i
                    v-if="item.icon"
                    :class="item.icon"
                    class="p-menu-item-icon"
                />
                <component
                    :is="item.lucideIcon"
                    v-else-if="item.lucideIcon"
                    class="p-menu-item-icon"
                />
                <span class="p-menu-item-label">{{ item.label }}</span>
            </a>
        </template>
    </Menu>
</template>
