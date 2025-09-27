import { ref, computed, onMounted, onUnmounted, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { LayoutGrid, House, Info, Settings, LogOut, ExternalLink, FileSearch, FolderGit2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { MenuItem } from '@/types'

export function useAppLayout() {
    const authStore = useAuthStore()
    const route = useRoute()

    const currentRoute = computed(() => route.name)
    const userName = computed(() => authStore?.user?.name ?? 'User')

    // Menu items
    const menuItems = computed<MenuItem[]>(() => [
        {
            label: 'Home',
            lucideIcon: House,
            route: { name: 'welcome' },
            active: currentRoute.value == 'welcome',
        },
        {
            label: 'Dashboard',
            lucideIcon: LayoutGrid,
            route: { name: 'dashboard' },
            active: currentRoute.value == 'dashboard',
        },
        {
            label: 'Resources',
            lucideIcon: Info,
            items: [
                {
                    label: 'Laravel Docs',
                    url: 'https://laravel.com/docs/master',
                    target: '_blank',
                    lucideIcon: ExternalLink,
                },
                {
                    label: 'PrimeVue Docs',
                    url: 'https://primevue.org/',
                    target: '_blank',
                    lucideIcon: ExternalLink,
                },
                {
                    label: 'Starter Kit Docs',
                    url: 'https://connorabbas.github.io/laravel-primevue-starter-kit-docs/',
                    target: '_blank',
                    lucideIcon: FileSearch,
                },
                {
                    label: 'Starter Kit Repo',
                    url: 'https://github.com/connorabbas/laravel-primevue-starter-kit',
                    target: '_blank',
                    lucideIcon: FolderGit2,
                },
            ],
        },
    ])

    // User menu and logout functionality.
    const userMenuItems: MenuItem[] = [
        {
            label: 'Settings',
            route: { name: 'settings.profile.edit' },
            lucideIcon: Settings,
        },
        {
            separator: true,
        },
        {
            label: 'Log out',
            lucideIcon: LogOut,
            command: () => authStore.logout(),
        },
    ]

    // Mobile menu
    const mobileMenuOpen = ref(false)
    const windowWidth = ref(window.innerWidth)
    const updateWidth = () => {
        windowWidth.value = window.innerWidth
    }
    onMounted(() => {
        window.addEventListener('resize', updateWidth)
    })
    onUnmounted(() => {
        window.removeEventListener('resize', updateWidth)
    })
    watchEffect(() => {
        if (windowWidth.value > 1024) {
            mobileMenuOpen.value = false
        }
    })

    return {
        userName,
        currentRoute,
        menuItems,
        userMenuItems,
        mobileMenuOpen,
    }
}
