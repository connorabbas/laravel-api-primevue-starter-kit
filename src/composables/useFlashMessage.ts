import { reactive, readonly, onMounted } from 'vue';

type FlashMessageType = 'success' | 'info' | 'warning' | 'danger';

const flashMessages = reactive<{
    success: string;
    info: string;
    warning: string;
    danger: string;
}>({
    success: '',
    info: '',
    warning: '',
    danger: '',
});

function setFlashMessage(type: FlashMessageType, message: string): void {
    flashMessages[type] = message;
}

function clearFlashMessages(): void {
    Object.keys(flashMessages).forEach((key) => {
        flashMessages[key as FlashMessageType] = '';
    });
}

export function useFlashMessage() {
    onMounted(() => {
        clearFlashMessages();
    });

    return {
        flashMessages: readonly(flashMessages),
        setFlashMessage,
        clearFlashMessages,
    };
}
