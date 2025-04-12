import { ref } from 'vue';
import axios from '@/utils/axios';
import progress from '@/utils/progress';
import { useAxiosErrorHandling } from '@/composables/useAxiosErrorHandling';

export function useAxiosForm(initialData = {}) {
    const { validationErrors, clearErrors, handleAxiosError } = useAxiosErrorHandling();
    const data = ref({ ...initialData });
    const processing = ref(false);

    const reset = (...fields) => {
        if (fields.length > 0) {
            fields.forEach((field) => {
                if (field in initialData) {
                    data.value[field] = initialData[field];
                }
            });
        } else {
            data.value = { ...initialData };
        }
    };

    const makeRequest = async (method, url, options = {}) => {
        const {
            showProgress = false,
            onBefore = () => {},
            onSuccess = () => {},
            onFinish = () => {},
            ...restOptions
        } = options;

        try {
            clearErrors();
            processing.value = true;
            if (showProgress) progress.start();
            onBefore();

            const config = {
                url,
                method,
                ...(method === 'get' ? { params: data.value } : { data: data.value }),
                ...restOptions,
            };

            const response = await axios(config);
            onSuccess(response);

            return response;
        } catch (error) {
            handleAxiosError(error);
        } finally {
            onFinish();
            processing.value = false;
            if (showProgress) progress.done();
        }
    };

    return {
        data,
        validationErrors,
        processing,
        reset,
        get: (url, options) => makeRequest('get', url, options),
        post: (url, options) => makeRequest('post', url, options),
        put: (url, options) => makeRequest('put', url, options),
        patch: (url, options) => makeRequest('patch', url, options),
        del: (url, options) => makeRequest('delete', url, options),
    };
}
