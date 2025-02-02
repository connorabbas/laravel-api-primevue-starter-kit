import { ref } from 'vue';
import axios from '@/utils/axios';
import progress from '@/utils/progress';
import { useAxiosErrorHandling } from '@/composables/useAxiosErrorHandling';

export function useAxiosForm(initialData = {}) {
    const { validationErrors, clearErrors, handleAxiosError } = useAxiosErrorHandling();

    const data = ref({ ...initialData });
    const processing = ref(false);

    let onSuccessCallback = null;
    let onFinishCallback = null;

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
        options = {
            showProgress: false,
            ...options,
        };
        try {
            clearErrors();
            processing.value = true;
            if (options.showProgress) {
                progress.start();
            }

            if (options.onBefore) options.onBefore();

            const response = await axios({
                url,
                method,
                data: data.value,
                ...options,
            });

            if (onSuccessCallback) onSuccessCallback(response);
            if (options.onSuccess) options.onSuccess(response);

            return response;
        } catch (error) {
            handleAxiosError(error, options);
        } finally {
            if (onFinishCallback) onFinishCallback();
            if (options.onFinish) options.onFinish();
            processing.value = false;
            if (progress.isStarted()) {
                progress.done();
            }
        }
    };

    const get = (url, options = {}) => makeRequest('get', url, options);
    const post = (url, options = {}) => makeRequest('post', url, options);
    const put = (url, options = {}) => makeRequest('put', url, options);
    const patch = (url, options = {}) => makeRequest('patch', url, options);
    const del = (url, options = {}) => makeRequest('delete', url, options);

    const onSuccess = (callback) => {
        onSuccessCallback = callback;
    };
    const onFinish = (callback) => {
        onFinishCallback = callback;
    };

    return {
        data,
        validationErrors,
        processing,
        reset,
        clearErrors,
        get,
        post,
        put,
        patch,
        del,
        onSuccess,
        onFinish,
    };
}
