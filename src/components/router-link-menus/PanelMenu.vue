<script setup lang="ts">
import { useTemplateRef } from 'vue'
import PanelMenu, { type PanelMenuPassThroughOptions, type PanelMenuProps } from 'primevue/panelmenu'
import { ChevronDown, ChevronRight } from 'lucide-vue-next'
import type { MenuItem } from '@/types'
import { ptViewMerge } from '@/utils'

interface ExtendedPanelMenuProps extends Omit<PanelMenuProps, 'model'> {
    model?: MenuItem[] | undefined;
}
const componentProps = defineProps<ExtendedPanelMenuProps>()

const defaultPt: PanelMenuPassThroughOptions = {
    root: 'p-0 m-0 gap-1',
    panel: 'p-0 bg-transparent border-0',
    header: 'p-0 border-0',
    itemContent: 'gap-1',
}

type PanelMenuType = InstanceType<typeof PanelMenu>;
const childRef = useTemplateRef<PanelMenuType>('child-ref')
defineExpose({ $el: childRef })
</script>

<template>
    <PanelMenu
        ref="child-ref"
        v-bind="{ ...componentProps, ...$attrs, pt: defaultPt, ptOptions: { mergeProps: ptViewMerge } }"
    >
        <template #item="{ item, root, active, props, hasSubmenu }">
            <Divider
                v-if="item.separator"
                pt:root:class="my-0"
            />
            <RouterLink
                v-else-if="item.visible !== false && item.route"
                v-slot="{ href, navigate }"
                :to="item.route"
                custom
            >
                <a
                    :href="href"
                    :target="item.target"
                    :class="[
                        'p-panelmenu-item-link flex items-center cursor-pointer no-underline px-3 py-2',
                        { 'font-bold! text-muted-color': item.active },
                    ]"
                    :style="item.style"
                    :aria-disabled="item.disabled === true"
                    custom
                    @click="navigate"
                >
                    <i
                        v-if="item.icon"
                        :class="[
                            root ? 'p-panelmenu-header-icon' : 'p-panelmenu-item-icon',
                            item.icon,
                        ]"
                    />
                    <component
                        :is="item.lucideIcon"
                        v-else-if="item.lucideIcon"
                        :class="[
                            root ? 'p-panelmenu-header-icon' : 'p-panelmenu-item-icon',
                            item.lucideIconClass,
                        ]"
                    />
                    <span>{{ item.label }}</span>
                </a>
            </RouterLink>
            <a
                v-else-if="item.visible !== false"
                v-bind="props.action"
                :href="item.url"
                :target="item.target"
                :class="[
                    'flex items-center cursor-pointer no-underline px-3 py-2',
                    hasSubmenu ? 'p-panelmenu-header-link' : 'p-panelmenu-item-link',
                ]"
                :style="item.style"
                :aria-disabled="item.disabled === true"
            >
                <i
                    v-if="item.icon"
                    :class="[
                        root ? 'p-panelmenu-header-icon' : 'p-panelmenu-item-icon',
                        item.icon,
                    ]"
                />
                <component
                    :is="item.lucideIcon"
                    v-else-if="item.lucideIcon"
                    :class="[
                        root ? 'p-panelmenu-header-icon' : 'p-panelmenu-item-icon',
                        item.lucideIconClass,
                    ]"
                />
                <span>{{ item.label }}</span>
                <template v-if="hasSubmenu">
                    <ChevronDown
                        v-if="active"
                        class="p-panelmenu-submenu-icon ml-auto"
                    />
                    <ChevronRight
                        v-else
                        class="p-panelmenu-submenu-icon ml-auto"
                    />
                </template>
            </a>
        </template>
    </PanelMenu>
</template>
