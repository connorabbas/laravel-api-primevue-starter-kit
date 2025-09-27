<script setup lang="ts">
import { useAppLayout } from '@/composables/useAppLayout';
import { ChevronsUpDown, Menu as MenuIcon } from 'lucide-vue-next';
import Container from '@/components/Container.vue';
import PopupMenuButton from '@/components/PopupMenuButton.vue';
import NavLogoLink from '@/components/NavLogoLink.vue';
import MenuBar from '@/components/primevue/menu/MenuBar.vue';
import PanelMenu from '@/components/primevue/menu/PanelMenu.vue';
import Breadcrumb from '@/components/primevue/menu/Breadcrumb.vue';
import { MenuItem } from '@/types';

const props = withDefaults(defineProps<{
    breadcrumbs?: MenuItem[],
}>(), {
    breadcrumbs: () => [],
});

const {
    userName,
    currentRoute,
    mobileMenuOpen,
    menuItems,
    userMenuItems,
} = useAppLayout();
</script>

<template>
    <div>
        <Teleport to="body">
            <!-- Mobile drawer menu -->
            <Drawer
                v-model:visible="mobileMenuOpen"
                position="right"
            >
                <div>
                    <PanelMenu
                        :model="menuItems"
                        class="mt-1 w-full"
                    />
                </div>
                <template #footer>
                    <PopupMenuButton
                        name="mobile-user-menu-dd"
                        :menu-items="userMenuItems"
                        :button-label="userName"
                    >
                        <template #toggleIcon>
                            <ChevronsUpDown />
                        </template>
                    </PopupMenuButton>
                </template>
            </Drawer>
            <ScrollTop
                :buttonProps="{ class: 'fixed! right-4! bottom-4! md:right-8! md:bottom-8! z-[1000]!', rounded: true, raised: true }"
            />
        </Teleport>
        <div class="min-h-screen">
            <!-- Primary Navigation Menu -->
            <nav class="dynamic-bg shadow-sm">
                <Container>
                    <MenuBar
                        :key="currentRoute"
                        :model="menuItems"
                        pt:root:class="px-0 py-0 border-0 rounded-none bg-transparent h-[var(--header-height)]!"
                        pt:button:class="hidden"
                    >
                        <template #start>
                            <div class="shrink-0 flex items-center mr-5">
                                <NavLogoLink />
                            </div>
                        </template>
                        <template #end>
                            <!-- User Dropdown Menu -->
                            <div class="hidden lg:flex items-center ms-6 space-x-3">
                                <div class="flex flex-col">
                                    <PopupMenuButton
                                        name="desktop-user-menu-dd"
                                        button-variant="text"
                                        fixed-position="right"
                                        :menu-items="userMenuItems"
                                        :button-label="userName"
                                    />
                                </div>
                            </div>

                            <!-- Mobile Menu Toggle -->
                            <div class="flex items-center lg:hidden">
                                <div class="relative">
                                    <Button
                                        severity="secondary"
                                        class="p-1!"
                                        text
                                        @click="mobileMenuOpen = true"
                                    >
                                        <template #icon>
                                            <MenuIcon class="size-6!" />
                                        </template>
                                    </Button>
                                </div>
                            </div>
                        </template>
                    </MenuBar>
                </Container>
            </nav>

            <main>
                <Container vertical>
                    <!-- Breadcrumbs -->
                    <Breadcrumb
                        v-if="props.breadcrumbs.length"
                        :model="props.breadcrumbs"
                    />
                    <!-- Page Content -->
                    <slot />
                </Container>
            </main>
        </div>
    </div>
</template>
