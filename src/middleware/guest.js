export default async function guest({ authStore }) {
    if (!authStore.user) {
        await authStore.fetchUser();
    }
    if (authStore.user) {
        return { name: 'dashboard' };
    }
}
