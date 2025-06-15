<script setup>
import { useTemplateRef, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAxiosForm } from '@/composables/useAxiosForm';
import { useAuthStore } from '@/stores/auth';
import GuestAuthLayout from '@/layouts/GuestAuthLayout.vue';
import InputErrors from '@/components/InputErrors.vue';

const router = useRouter();
const authStore = useAuthStore();

const nameInput = useTemplateRef('name-input');

const {
    data: formData,
    validationErrors,
    processing: registering,
    post: submitForm,
} = useAxiosForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
});
const submit = () => {
    authStore.fetchCsrfCookie().then(() => {
        submitForm('/register', {
            onSuccess: () => {
                router.push({ name: 'dashboard' });
            },
        });
    });
};

const loading = computed(() => {
    return registering.value || authStore.fetchingCsrfToken || authStore.fetchingUser;
});

onMounted(() => {
    nameInput.value.$el.focus();
});
</script>

<template>
    <GuestAuthLayout>
        <template #title>
            <div class="text-center">
                Create an account
            </div>
        </template>

        <template #subtitle>
            <div class="text-center">
                Enter your details below to create your account
            </div>
        </template>

        <form
            class="space-y-6 sm:space-y-8"
            @submit.prevent="submit"
        >
            <div class="flex flex-col gap-2">
                <label for="name">Name</label>
                <InputText
                    id="name"
                    ref="name-input"
                    v-model="formData.name"
                    :invalid="Boolean(validationErrors?.name)"
                    type="text"
                    autocomplete="name"
                    required
                    fluid
                />
                <InputErrors :errors="validationErrors?.name" />
            </div>

            <div class="flex flex-col gap-2">
                <label for="email">Email address</label>
                <InputText
                    id="email"
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
                <label for="password">Password</label>
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
                <label for="password-confirmation">Confirm password</label>
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
                    label="Create Account"
                    :loading="loading"
                    fluid
                />
            </div>

            <div class="text-center">
                <span class="text-muted-color mr-1">Already have an account?</span>
                <RouterLink :to="{ name: 'login' }">
                    <Button
                        class="p-0"
                        variant="link"
                        label="Log in"
                    />
                </RouterLink>
            </div>
        </form>
    </GuestAuthLayout>
</template>
