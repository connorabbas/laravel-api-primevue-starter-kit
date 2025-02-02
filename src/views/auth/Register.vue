<script setup>
import { useTemplateRef, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAxiosForm } from '@/composables/useAxiosForm';
import { useAuthStore } from '@/stores/auth';
import GuestLayout from '@/layouts/GuestLayout.vue';
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
    <GuestLayout>
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
                    type="text"
                    class="w-full"
                    :invalid="Boolean(validationErrors?.name)"
                    autocomplete="name"
                    required
                />
                <InputErrors :errors="validationErrors?.name" />
            </div>

            <div class="flex flex-col gap-2">
                <label for="email">Email</label>
                <InputText
                    id="email"
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
                <label for="password">Password</label>
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
                <label for="password_confirmation">Confirm Password</label>
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
                <RouterLink
                    :to="{ name: 'login' }"
                    class="mr-4 underline text-muted-color hover:text-color"
                >
                    Already registered?
                </RouterLink>
                <Button
                    type="submit"
                    label="Register"
                    severity="contrast"
                    :loading="loading"
                    raised
                />
            </div>
        </form>
    </GuestLayout>
</template>
