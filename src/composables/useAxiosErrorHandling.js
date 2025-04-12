import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

export function useAxiosErrorHandling() {
    const router = useRouter();
    const toast = useToast();
    const validationErrors = ref({});

    const clearErrors = (...fields) => {
        if (fields.length > 0) {
            fields.forEach((field) => {
                if (field in validationErrors.value) {
                    delete validationErrors.value[field];
                }
            });
        } else {
            validationErrors.value = {};
        }
    };

    const showErrorToast = (summary, detail) => {
        //toast.removeGroup('error');
        toast.add({
            severity: 'error',
            summary,
            detail,
            group: 'error',
            life: 3000,
        });
    };

    const handleAxiosError = (error, options = {}) => {
        if (error.response) {
            const status = error.response.status;
            const responseData = error.response.data;

            if (status === 401) {
                //router.push({ name: 'login' });
                showErrorToast('Unauthorized', 'Please log in to continue.');
            } else if (status === 419) {
                router.push({ name: 'login' });
                showErrorToast('Session Expired', 'Please log in again.');
            } else if (status === 422 && responseData?.errors) {
                validationErrors.value = responseData.errors;
                //showErrorToast('Validation Error', 'Validation failed.');
            } else if (status >= 500) {
                showErrorToast('Server Error', 'A critical error occurred.');
            }
        } else if (error.request) {
            showErrorToast('Network Error', 'Technical difficulties, please try again later.');
            //console.error('Network Error:', error.message);
        }

        if (options.onError) options.onError(error);
    };

    return {
        validationErrors,
        clearErrors,
        handleAxiosError,
    };
}
