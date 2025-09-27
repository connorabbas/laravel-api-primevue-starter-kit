import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import type { AxiosError } from 'axios'

type ValidationErrors = Record<string, string[]>;

interface ValidationErrorResponse {
    errors: ValidationErrors;
}

interface ErrorHandlingOptions {
    onError?: (error: AxiosError) => void;
}

export function useAxiosErrorHandling() {
    const router = useRouter()
    const toast = useToast()
    const validationErrors = ref<ValidationErrors>({})

    function clearErrors(...fields: string[]): void {
        if (fields.length > 0) {
            fields.forEach(field => {
                if (field in validationErrors.value) {
                    delete validationErrors.value[field]
                }
            })
        } else {
            validationErrors.value = {}
        }
    }

    function showErrorToast(summary: string, detail: string, severity: 'error' | 'warn' = 'error'): void {
        toast.add({
            severity,
            summary,
            detail,
            life: 5000,
        })
    }

    function handleAxiosError(
        error: AxiosError,
        options: ErrorHandlingOptions = {}
    ): void {
        if (error.response) {
            const { status, data: responseData } = error.response

            if (status === 401) {
                console.log('User is unauthorized')
                //showErrorToast('401 - Unauthorized', 'Please reload the page and login in.', 'warn');
            } else if (status === 403) {
                showErrorToast('403 - Forbidden', 'Sorry, you are unauthorized to access this resource/action.', 'warn')
            } else if (status === 404) {
                showErrorToast('404 - Not Found', 'Sorry, the resource you are looking for could not be found.', 'warn')
            } else if (status === 419) {
                router.push({ name: 'login' }).then(() => {
                    showErrorToast('419 - Session Expired ', 'Please reload the page.', 'warn')
                })
            } else if (status === 422) {
                const errorData = responseData as ValidationErrorResponse
                if (errorData.errors) {
                    validationErrors.value = errorData.errors
                }
            } else if (status === 500) {
                showErrorToast('500 - Server Error', 'Whoops, something went wrong on our end. Please try again.')
            } else if (status === 503) {
                showErrorToast(
                    '503 - Service Unavailable',
                    'Sorry, we are doing some maintenance. Please check back soon.'
                )
            } else {
                showErrorToast('Error', 'Something went wrong...')
            }
        } else if (error.request) {
            showErrorToast('Error', 'We are experiencing technical difficulties, please try again later.')
        }

        options.onError?.(error)
    }

    return {
        validationErrors,
        clearErrors,
        handleAxiosError,
    }
}
