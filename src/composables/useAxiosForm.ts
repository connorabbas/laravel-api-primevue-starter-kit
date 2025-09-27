import { ref } from 'vue';
import axios from '@/utils/axios';
import progress from '@/utils/progress';
import { useAxiosErrorHandling } from './useAxiosErrorHandling';
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

type FormData = Record<string, any>;

interface RequestOptions {
    showProgress?: boolean;
    onBefore?: () => void;
    onSuccess?: (response: AxiosResponse) => void;
    onError?: (error: AxiosError) => void;
    onFinish?: () => void;
    [key: string]: any; // For additional Axios config options
}

export function useAxiosForm<T extends FormData>(initialData: T = {} as T) {
    const { validationErrors, clearErrors, handleAxiosError } = useAxiosErrorHandling();
    const data = ref<T>({ ...initialData });
    const processing = ref<boolean>(false);

    const reset = (...fields: string[]): void => {
        if (fields.length > 0) {
            fields.forEach((field) => {
                if (field in initialData) {
                    data.value[field as keyof T] = initialData[field];
                }
            });
        } else {
            data.value = { ...initialData };
        }
    };

    const makeRequest = async (
        method: 'get' | 'post' | 'put' | 'patch' | 'delete',
        url: string,
        options: RequestOptions = {}
    ): Promise<AxiosResponse | undefined> => {
        const {
            showProgress = false,
            onBefore = () => { },
            onSuccess = () => { },
            onError = () => { },
            onFinish = () => { },
            headers: customHeaders,
            ...restOptions
        } = options;

        try {
            clearErrors();
            processing.value = true;
            if (showProgress) progress.start();
            onBefore();

            const finalHeaders = {
                'X-Requested-With': 'XMLHttpRequest',
                ...(customHeaders || {}),
            };

            const config: AxiosRequestConfig = {
                url,
                method,
                ...(method === 'get' ? { params: data.value } : { data: data.value }),
                headers: finalHeaders,
                ...restOptions,
            };

            const response: AxiosResponse = await axios(config);
            onSuccess(response);

            return response;
        } catch (error) {
            const axiosError = error as AxiosError;
            onError(axiosError);
            handleAxiosError(axiosError);
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
        get: (url: string, options?: RequestOptions) => makeRequest('get', url, options),
        post: (url: string, options?: RequestOptions) => makeRequest('post', url, options),
        put: (url: string, options?: RequestOptions) => makeRequest('put', url, options),
        patch: (url: string, options?: RequestOptions) => makeRequest('patch', url, options),
        del: (url: string, options?: RequestOptions) => makeRequest('delete', url, options),
    };
}
