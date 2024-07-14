import { defineStore } from 'pinia';
import router from '@/router';
import axios from '@/modules/axios.mjs';
import apiRoutes from '@/modules/api-routes.mjs';
import progress from '@/modules/progress.mjs';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        authUser: null,
    }),
    getters: {
        user: (state) => state.authUser,
    },
    actions: {
        getUser() {
            return axios
                .get(apiRoutes.user)
                .then((response) => {
                    this.authUser = response.data;
                })
                .catch((error) => {
                    if (error.response && error.response.status == 401) {
                        this.authUser = null;
                    }
                });
        },
        getCsrfCookie() {
            return axios.get(apiRoutes.sanctumCsrfCookie);
        },
        loginRedirect() {
            const redirect = router.currentRoute.value.query.redirect;
            if (redirect) {
                router.push({ path: redirect });
            } else {
                router.push({ name: 'dashboard' });
            }
        },
        login(formData) {
            // fetching CSRF cookie not necessarily needed since we are pinging the user endpoint prior
            progress.start();
            return this.getCsrfCookie()
                .then(() => {
                    return axios.post(apiRoutes.auth.login, formData).then((response) => {
                        this.loginRedirect();
                    });
                })
                .finally(() => {
                    progress.done();
                });
        },
        register(formData) {
            progress.start();
            return axios
                .post(apiRoutes.auth.register, formData)
                .then((response) => {
                    this.loginRedirect();
                })
                .finally(() => {
                    progress.done();
                });
        },
        logout() {
            return axios.post(apiRoutes.auth.logout).then((response) => {
                this.authUser = null;
                router.push({ name: 'home' });
            });
        },
    },
});
