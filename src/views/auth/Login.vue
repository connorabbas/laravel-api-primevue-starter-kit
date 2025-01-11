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
                    :invalid="Boolean(validationErrors.email)"
                    autocomplete="username"
                    required
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
                    id="password"
                    v-model="formData.password"
                    type="password"
                    class="w-full"
                    :invalid="Boolean(validationErrors.password)"
                    autocomplete="current-password"
                    required
                />
                <InputErrors :errors="validationErrors.password" />
            </div>

            <div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <Checkbox
                            id="remember"
                            v-model="formData.remember"
                            :binary="true"
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
                    type="submit"
                    label="Log In"
                    severity="contrast"
                    :loading="loading"
                    raised
                />
            </div>
        </form>
    </GuestLayout>
</template>
