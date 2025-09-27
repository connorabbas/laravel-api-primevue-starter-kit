import { Middleware, MiddlewareContext } from "@/types";

export default async function verified({ to, authStore }: MiddlewareContext): ReturnType<Middleware> {
    if (to.name === 'verifyEmail') return;

    if (!authStore.user) {
        await authStore.fetchUser();
    }

    // Check if user must verify email
    if (
        authStore.mustVerifyEmail &&
        !!authStore.user?.id &&
        authStore.user.email_verified_at === null
    ) {
        return { name: 'verifyEmail' };
    }
}
