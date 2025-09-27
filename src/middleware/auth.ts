import { Middleware, MiddlewareContext } from "@/types"

export default async function auth({ to, authStore }: MiddlewareContext): ReturnType<Middleware> {
    await authStore.fetchUser()
    if (!authStore.user) {
        return { name: 'login', query: { redirect: to.fullPath } }
    }
}
