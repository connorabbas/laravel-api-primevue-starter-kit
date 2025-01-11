<script setup>
import { useTemplateRef, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAxiosForm } from '@/composables/useAxiosForm';
import { useAuthStore } from '@/stores/auth';
import { useFlashMessage } from '@/composables/useFlashMessage.js';
import GuestLayout from '@/layouts/GuestLayout.vue';
import InputErrors from '@/components/InputErrors.vue';

const router = useRouter();
const authStore = useAuthStore();
const { flashMessages } = useFlashMessage();

const emailInput = useTemplateRef('email-input');

const {
    data: formData,
    validationErrors,
    processing: loggingIn,
    post: submitForm,
    reset: resetFormData,
} = useAxiosForm({
    email: '',
    password: '',
    remember: false,
});
const submit = () => {
    authStore.fetchCsrfCookie().then(() => {
        submitForm('/login', {
            onSuccess: () => {
                const redirectPath = router.currentRoute.value.query?.redirect;
                if (redirectPath) {
                    router.push({ path: redirectPath });
                } else {
                    router.push({ name: 'dashboard' });
                }
            },
            onFinish: () => {
                resetFormData('password');
            },
        });
    });
};

const loading = computed(() => {
    return loggingIn.value || authStore.fetchingCsrfToken;
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
                    :invalid="Boolean(validationErrors.email)"
                    autocomplete="username"
                />
                <InputErrors :errors="validationErrors.email" />
            </div>

            <div class="space-y-2">
                <label
                    for="password"
                    class="block mb-2"
                    >Password</label
                >
                <InputText
                    required
                    id="password"
                    type="password"
                    v-model="formData.password"
                    class="w-full"
                    :invalid="Boolean(validationErrors.password)"
                    autocomplete="current-password"
                />
                <InputErrors :errors="validationErrors.password" />
            </div>

            <div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <Checkbox
                            id="remember"
                            :binary="true"
                            v-model="formData.remember"
                            class="mr-2"
                        ></Checkbox>
                        <label for="remember">Remember me</label>
                    </div>
                </div>
            </div>

            <div class="flex justify-end items-center pt-2">
                <RouterLink
                    :to="{ name: 'forgotPassword' }"
                    class="mr-4 underline text-muted-color hover:text-color"
                >
                    Forgot your password?
                </RouterLink>
                <Button
                    raised
                    type="submit"
                    :loading="loading"
                    label="Log In"
                    severity="contrast"
                />
            </div>
        </form>
    </GuestLayout>
</template>
