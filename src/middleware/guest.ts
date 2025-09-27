import { Middleware, MiddlewareContext } from "@/types"

export default async function guest({ authStore }: MiddlewareContext): ReturnType<Middleware> {
    if (!authStore.user) {
        await authStore.fetchUser()
    }
    if (authStore.user) {
        return { name: 'dashboard' }
    }
}

