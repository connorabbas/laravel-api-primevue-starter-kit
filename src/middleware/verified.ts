export default async function verified({ to, authStore }) {
    if (to.name === 'verifyEmail') return;

    if (!authStore.user) {
        await authStore.fetchUser();
    }

    if (authStore.mustVerifyEmail && new Boolean(authStore.user?.id) && authStore.user.email_verified_at === null) {
        return { name: 'verifyEmail' };
    }
}
