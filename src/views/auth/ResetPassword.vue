<script setup>
import { useTemplateRef, computed, onMounted } from 'vue';
import { useAxiosForm } from '@/composables/useAxiosForm';
import { useAuthStore } from '@/stores/auth';
import { useRoute, useRouter } from 'vue-router';
import { useFlashMessage } from '@/composables/useFlashMessage.js';
import GuestLayout from '@/layouts/GuestLayout.vue';
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
    <GuestLayout>
        <form
            class="space-y-6"
            @submit.prevent="submit"
        >
            <div class="space-y-2">
                <label
                    for="email"
                    class="block mb-2"
                    >Email</label
                >
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

            <div class="space-y-2">
                <label
                    for="password"
                    class="block mb-2"
                    >New Password</label
                >
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

            <div class="space-y-2">
                <label
                    for="password_confirmation"
                    class="block mb-2"
                    >Confirm New Password</label
                >
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
                    severity="contrast"
                    :loading="loading"
                    raised
                />
            </div>
        </form>
    </GuestLayout>
</template>
