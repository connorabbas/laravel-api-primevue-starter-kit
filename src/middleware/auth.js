export default async function auth({ to, from, authStore }) {
    await authStore.fetchUser();
    if (!authStore.user) {
        return { name: 'login', query: { redirect: to.fullPath } };
    }
}
