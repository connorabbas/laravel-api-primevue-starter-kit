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
    return registering.value || authStore.fetchingCsrfToken;
});

onMounted(() => {
    nameInput.value.$el.focus();
});
</script>

<template>
    <GuestAuthLayout>
        <form
            class="space-y-6"
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
                <label for="email">Email</label>
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
                <label for="password-confirmation">Confirm Password</label>
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

            <div class="flex justify-end items-center pt-2">
                <RouterLink
                    :to="{ name: 'login' }"
                    class="mr-4 underline text-muted-color hover:text-color"
                >
                    Already registered?
                </RouterLink>
                <Button
                    type="submit"
                    label="Register"
                    :loading="loading"
                />
            </div>
        </form>
    </GuestAuthLayout>
</template>
