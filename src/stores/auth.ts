import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useFlashMessage } from '@/composables/useFlashMessage.js'
import { useAxiosForm } from '@/composables/useAxiosForm'
import { useRouter } from 'vue-router'
import type { AxiosResponse, AxiosError } from 'axios'
import { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()
    const { setFlashMessage } = useFlashMessage()

    const mustVerifyEmail = false

    const user = ref<User | null>(null)

    /**
     * Fetch authenticated user
     */
    const { get: submitFetchUserForm, processing: fetchingUser } = useAxiosForm()
    function fetchUser() {
        return submitFetchUserForm('/api/user', {
            onSuccess: (response: AxiosResponse<User>) => {
                if (response.status >= 200) {
                    user.value = response.data
                }
            },
            onError: (error: AxiosError) => {
                if (error.request || (error.response && error.response.status === 401)) {
                    user.value = null
                }
            },
        })
    }

    /**
     * Fetch CSRF cookie
     */
    const { get: submitFetchCsrfCookie, processing: fetchingCsrfToken } = useAxiosForm()
    function fetchCsrfCookie() {
        return submitFetchCsrfCookie('/sanctum/csrf-cookie')
    }

    /**
     * Send verification email
     */
    const { post: submitVerificationEmailForm, processing: sendingVerificationEmail } = useAxiosForm()
    function sendVerificationEmail() {
        return submitVerificationEmailForm('/email/verification-notification', {
            onSuccess: (response: AxiosResponse<{ status: string }>) => {
                setFlashMessage('success', response.data.status)
            },
        })
    }

    /**
     * Logout user
     */
    const { post: submitLogoutForm } = useAxiosForm()
    function logout() {
        return submitLogoutForm('/logout', {
            showProgress: true,
            onSuccess: () => {
                user.value = null
                router.push({ name: 'welcome' })
            },
        })
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
    }
})
