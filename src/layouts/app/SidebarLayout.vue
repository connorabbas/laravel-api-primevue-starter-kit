<script setup lang="ts">
import { ChevronsUpDown, Menu as MenuIcon } from 'lucide-vue-next'
import { useAppLayout } from '@/composables/useAppLayout'
import Container from '@/components/Container.vue'
import PopupMenuButton from '@/components/PopupMenuButton.vue'
import NavLogoLink from '@/components/NavLogoLink.vue'
import PanelMenu from '@/components/primevue/menu/PanelMenu.vue'
import Breadcrumb from '@/components/primevue/menu/Breadcrumb.vue'
import { MenuItem } from 'primevue/menuitem'

const props = withDefaults(defineProps<{
    breadcrumbs?: MenuItem[],
}>(), {
    breadcrumbs: () => [],
})

const {
    userName,
    mobileMenuOpen,
    menuItems,
    userMenuItems,
} = useAppLayout()
</script>

<template>
    <div class="h-screen flex flex-col">
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
                        button-size="large"
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

        <!-- Mobile Header -->
        <header class="block lg:fixed top-0 left-0 right-0 z-50">
            <nav class="dynamic-bg shadow-sm flex justify-between items-center lg:hidden">
                <Container class="grow">
                    <div class="flex justify-between items-center gap-4 py-4">
                        <div>
                            <NavLogoLink />
                        </div>
                        <div>
                            <Button
                                severity="secondary"
                                text
                                @click="mobileMenuOpen = true"
                            >
                                <template #icon>
                                    <MenuIcon class="size-6!" />
                                </template>
                            </Button>
                        </div>
                    </div>
                </Container>
            </nav>
        </header>

        <div class="flex-1">
            <!-- Desktop Sidebar -->
            <aside
                class="w-[18rem] inset-0 hidden lg:block fixed overflow-y-auto overflow-x-hidden dynamic-bg border-r dynamic-border"
            >
                <div class="w-full h-full flex flex-col justify-between p-4">
                    <div class="space-y-6">
                        <div class="p-2">
                            <NavLogoLink />
                        </div>
                        <div>
                            <PanelMenu
                                :model="menuItems"
                                class="mt-1 w-full"
                            />
                        </div>
                    </div>
                    <div>
                        <PopupMenuButton
                            name="desktop-user-menu-dd"
                            :menu-items="userMenuItems"
                            :button-label="userName"
                        >
                            <template #toggleIcon>
                                <ChevronsUpDown />
                            </template>
                        </PopupMenuButton>
                    </div>
                </div>
            </aside>

            <!-- Scrollable Content -->
            <main class="flex flex-col h-full lg:pl-[18rem]">
                <Container
                    vertical
                    fluid
                >
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
