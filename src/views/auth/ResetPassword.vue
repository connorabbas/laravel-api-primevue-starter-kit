<script setup>
import { useTemplateRef, computed, onMounted } from 'vue';
import { useAxiosForm } from '@/composables/useAxiosForm';
import { useAuthStore } from '@/stores/auth';
import { useRoute, useRouter } from 'vue-router';
import { useFlashMessage } from '@/composables/useFlashMessage.js';
import GuestAuthLayout from '@/layouts/GuestAuthLayout.vue';
import InputErrors from '@/components/InputErrors.vue';

const props = defineProps({
    token: {
        type: String,
        required: true,
    },
});

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { setFlashMessage } = useFlashMessage();

const emailInput = useTemplateRef('email-input');

const {
    data: formData,
    validationErrors,
    processing: resetting,
    post: submitForm,
} = useAxiosForm({
    token: props.token,
    email: route.query?.email ?? '',
    password: '',
    password_confirmation: '',
});
const submit = () => {
    authStore.fetchCsrfCookie().then(() => {
        submitForm('/reset-password', {
            onSuccess: (response) => {
                router.push({ name: 'login' }).then(() => {
                    setFlashMessage('success', response.data.status);
                });
            },
        });
    });
};

const loading = computed(() => {
    return resetting.value || authStore.fetchingCsrfToken;
});

onMounted(() => {
    emailInput.value.$el.focus();
});
</script>

<template>
    <GuestAuthLayout>
        <template #title>
            <div class="text-center">
                Reset password
            </div>
        </template>

        <template #subtitle>
            <div class="text-center">
                Please enter your new password below
            </div>
        </template>

        <form
            class="space-y-6 sm:space-y-8"
            @submit.prevent="submit"
        >
            <div class="flex flex-col gap-2">
                <label for="email">Email address</label>
                <InputText
                    id="email"
                    ref="email-input"
                    v-model="formData.email"
                    :invalid="Boolean(validationErrors?.email)"
                    type="email"
                    autocomplete="username"
                    required
                    fluid
                />
                <InputErrors :errors="validationErrors?.email" />
            </div>

            <div class="flex flex-col gap-2">
                <label for="password">New Password</label>
                <Password
                    v-model="formData.password"
                    :invalid="Boolean(validationErrors?.password)"
                    autocomplete="new-password"
                    inputId="password"
                    toggleMask
                    required
                    fluid
                />
                <InputErrors :errors="validationErrors?.password" />
            </div>

            <div class="flex flex-col gap-2">
                <label for="password-confirmation">Confirm New Password</label>
                <Password
                    v-model="formData.password_confirmation"
                    :invalid="Boolean(validationErrors?.password_confirmation)"
                    :feedback="false"
                    autocomplete="new-password"
                    inputId="password-confirmation"
                    toggleMask
                    required
                    fluid
                />
                <InputErrors :errors="validationErrors?.password_confirmation" />
            </div>

            <div>
                <Button
                    type="submit"
                    label="Reset password"
                    :loading="loading"
                    fluid
                />
            </div>
        </form>
    </GuestAuthLayout>
</template>
