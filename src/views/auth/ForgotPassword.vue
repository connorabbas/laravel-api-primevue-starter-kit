<script setup>
import { useTemplateRef, computed, onMounted } from 'vue';
import { useAxiosForm } from '@/composables/useAxiosForm';
import { useAuthStore } from '@/stores/auth';
import { useFlashMessage } from '@/composables/useFlashMessage.js';
import GuestLayout from '@/layouts/GuestLayout.vue';
import InputErrors from '@/components/InputErrors.vue';

const authStore = useAuthStore();
const { flashMessages, setFlashMessage } = useFlashMessage();

const emailInput = useTemplateRef('email-input');

const {
    data: formData,
    validationErrors,
    processing: submittingRequest,
    post: submitForm,
} = useAxiosForm({
    email: '',
});
const submit = () => {
    authStore.fetchCsrfCookie().then(() => {
        submitForm('/forgot-password', {
            onSuccess: (response) => {
                setFlashMessage('success', response.data.status);
            },
        });
    });
};

const loading = computed(() => {
    return submittingRequest.value || authStore.fetchingCsrfToken;
});

onMounted(() => {
    emailInput.value.$el.focus();
});
</script>

<template>
    <GuestLayout>
        <template
            #message
            v-if="flashMessages.success"
        >
            <Message
                severity="success"
                :closable="false"
                class="shadow"
            >
                {{ flashMessages.success }}
            </Message>
        </template>

        <div class="mb-6 text-sm text-muted-color">
            Forgot your password? No problem. Just let us know your email address and we will email you a password reset
            link that will allow you to choose a new one.
        </div>

        <form
            @submit.prevent="submit"
            class="space-y-6"
        >
            <div class="space-y-2">
                <label
                    for="email"
                    class="block mb-2"
                    >Email</label
                >
                <InputText
                    required
                    ref="email-input"
                    id="email"
                    type="email"
                    v-model="formData.email"
                    class="w-full"
                    :invalid="Boolean(validationErrors?.email)"
                    autocomplete="username"
                />
                <InputErrors :errors="validationErrors?.email" />
            </div>

            <div class="flex justify-end items-center">
                <Button
                    type="submit"
                    :loading="loading"
                    label="Email Password Reset Link"
                    severity="contrast"
                    raised
                />
            </div>
        </form>
    </GuestLayout>
</template>
