<script setup lang="ts">
import { useTemplateRef, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAxiosForm } from '@/composables/useAxiosForm';
import { useAuthStore } from '@/stores/auth';
import { useFlashMessage } from '@/composables/useFlashMessage.js';
import GuestAuthLayout from '@/layouts/GuestAuthLayout.vue';
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
    return loggingIn.value || authStore.fetchingCsrfToken || authStore.fetchingUser;
});

onMounted(() => {
    emailInput.value.$el.focus();
});
</script>

<template>
    <GuestAuthLayout>
        <template
            v-if="flashMessages.success"
            #message
        >
            <Message
                severity="success"
                :closable="false"
                class="shadow-sm"
            >
                {{ flashMessages.success }}
            </Message>
        </template>

        <template #title>
            <div class="text-center">
                Log in to your account
            </div>
        </template>

        <template #subtitle>
            <div class="text-center">
                Enter your email and password below to log in
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
                <div class="flex items-center justify-between">
                    <label for="password">Password</label>
                    <RouterLink :to="{ name: 'forgotPassword' }">
                        <Button
                            class="p-0"
                            variant="link"
                            label="Forgot your password?"
                        />
                    </RouterLink>
                </div>
                <Password
                    v-model="formData.password"
                    :invalid="Boolean(validationErrors?.password)"
                    :feedback="false"
                    autocomplete="current-password"
                    inputId="password"
                    toggleMask
                    required
                    fluid
                />
                <InputErrors :errors="validationErrors?.password" />
            </div>

            <div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <Checkbox
                            v-model="formData.remember"
                            class="mr-2"
                            inputId="remember"
                            :binary="true"
                        />
                        <label for="remember">Remember me</label>
                    </div>
                </div>
            </div>

            <div>
                <Button
                    :loading="loading"
                    type="submit"
                    label="Log in"
                    fluid
                />
            </div>

            <div class="text-center">
                <span class="text-muted-color mr-1">Don't have an account?</span>
                <RouterLink :to="{ name: 'register' }">
                    <Button
                        class="p-0"
                        variant="link"
                        label="Sign up"
                    />
                </RouterLink>
            </div>
        </form>
    </GuestAuthLayout>
</template>
