import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useFlashMessage } from '@/composables/useFlashMessage.js';
import { useAxiosForm } from '@/composables/useAxiosForm';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();
    const { setFlashMessage } = useFlashMessage();

    const mustVerifyEmail = false;

    const user = ref(null);

    const { get: submitFetchUserForm, processing: fetchingUser } = useAxiosForm();
    function fetchUser() {
        return submitFetchUserForm('/api/user', {
            onSuccess: (response) => {
                if (response.status >= 200) {
                    user.value = response.data;
                }
            },
            onError: (error) => {
                if (error.request || (error.response && error.response.status === 401)) {
                    user.value = null;
                }
            },
        });
    }

    const { get: submitFetchCsrfCookie, processing: fetchingCsrfToken } = useAxiosForm();
    function fetchCsrfCookie() {
        return submitFetchCsrfCookie('/sanctum/csrf-cookie');
    }

    const { post: submitVerificationEmailForm, processing: sendingVerificationEmail } = useAxiosForm();
    function sendVerificationEmail() {
        return submitVerificationEmailForm('/email/verification-notification', {
            onSuccess: (response) => {
                setFlashMessage('success', response.data.status);
            },
        });
    }

    const { post: submitLogoutForm } = useAxiosForm();
    function logout() {
        return submitLogoutForm('/logout', {
            showProgress: true,
            onSuccess: (response) => {
                user.value = null;
                router.push({ name: 'welcome' });
            },
        });
    }

    return {
        mustVerifyEmail,
        user,
        fetchingUser,
        fetchingCsrfToken,
        sendingVerificationEmail,
        fetchUser,
        fetchCsrfCookie,
        sendVerificationEmail,
        logout,
    };
});
