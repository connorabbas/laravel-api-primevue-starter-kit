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
            @submit.prevent="submit"
            class="space-y-6"
        >
            <div class="space-y-2">
                <label
                    for="name"
                    class="block mb-2"
                    >Name</label
                >
                <InputText
                    ref="name-input"
                    id="name"
                    type="text"
                    v-model="formData.name"
                    class="w-full"
                    :invalid="Boolean(validationErrors?.name)"
                    required
                    autocomplete="name"
                />
                <InputErrors :errors="validationErrors?.name" />
            </div>

            <div class="space-y-2">
                <label
                    for="email"
                    class="block mb-2"
                    >Email</label
                >
                <InputText
                    id="email"
                    type="email"
                    v-model="formData.email"
                    class="w-full"
                    :invalid="Boolean(validationErrors?.email)"
                    required
                    autocomplete="username"
                />
                <InputErrors :errors="validationErrors?.email" />
            </div>

            <div class="space-y-2">
                <label
                    for="password"
                    class="block mb-2"
                    >Password</label
                >
                <InputText
                    id="password"
                    type="password"
                    v-model="formData.password"
                    class="w-full"
                    :invalid="Boolean(validationErrors?.password)"
                    required
                    autocomplete="new-password"
                />
                <InputErrors :errors="validationErrors?.password" />
            </div>

            <div class="space-y-2">
                <label
                    for="password_confirmation"
                    class="block mb-2"
                    >Confirm Password</label
                >
                <InputText
                    id="password_confirmation"
                    type="password"
                    v-model="formData.password_confirmation"
                    class="w-full"
                    :invalid="Boolean(validationErrors?.password_confirmation)"
                    required
                    autocomplete="new-password"
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
                    raised
                    type="submit"
                    :loading="loading"
                    label="Register"
                    severity="contrast"
                />
            </div>
        </form>
    </GuestLayout>
</template>
