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
        <form
            class="space-y-6"
            @submit.prevent="submit"
        >
            <div class="flex flex-col gap-2">
                <label for="email">Email</label>
                <InputText
                    id="email"
                    ref="email-input"
                    v-model="formData.email"
                    type="email"
                    class="w-full"
                    :invalid="Boolean(validationErrors?.email)"
                    autocomplete="username"
                    required
                />
                <InputErrors :errors="validationErrors?.email" />
            </div>

            <div class="flex flex-col gap-2">
                <label for="password">New Password</label>
                <InputText
                    id="password"
                    v-model="formData.password"
                    type="password"
                    class="w-full"
                    :invalid="Boolean(validationErrors?.password)"
                    autocomplete="new-password"
                    required
                />
                <InputErrors :errors="validationErrors?.password" />
            </div>

            <div class="flex flex-col gap-2">
                <label for="password_confirmation">Confirm New Password</label>
                <InputText
                    id="password_confirmation"
                    v-model="formData.password_confirmation"
                    type="password"
                    class="w-full"
                    :invalid="Boolean(validationErrors?.password_confirmation)"
                    autocomplete="new-password"
                    required
                />
                <InputErrors :errors="validationErrors?.password_confirmation" />
            </div>

            <div class="flex justify-end items-center pt-2">
                <Button
                    type="submit"
                    label="Reset Password"
                    :loading="loading"
                />
            </div>
        </form>
    </GuestAuthLayout>
</template>
