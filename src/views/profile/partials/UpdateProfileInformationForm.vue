<script setup>
import { useTemplateRef, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useAxiosForm } from '@/composables/useAxiosForm';
import { useAuthStore } from '@/stores/auth';
import { useFlashMessage } from '@/composables/useFlashMessage.js';
import InputErrors from '@/components/InputErrors.vue';

const toast = useToast();
const authStore = useAuthStore();
const { flashMessages } = useFlashMessage();

const nameInput = useTemplateRef('name-input');

const verificationLinkSent = computed(() => flashMessages.success === 'verification-link-sent');

const {
    data: formData,
    validationErrors,
    processing: updating,
    patch: submitForm,
} = useAxiosForm({
    name: authStore.user.name || '',
    email: authStore.user.email || '',
});
const submit = () => {
    submitForm('/profile', {
        onSuccess: async () => {
            toast.add({
                severity: 'success',
                summary: 'Saved',
                detail: 'Profile information has been updated',
                life: 3000,
            });
            authStore.fetchUser();
        },
    });
};

const resendVerifyEmail = () => {
    authStore.sendVerificationEmail();
};

onMounted(() => {
    nameInput.value.$el.focus();
});
</script>

<template>
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

        <div v-if="authStore.mustVerifyEmail && authStore.user.email_verified_at === null">
            <p class="text-sm mt-2">
                Your email address is unverified.
                <a
                    href="#"
                    class="text-sm underline text-muted-color hover:text-color"
                    @click="resendVerifyEmail"
                >
                    Click here to re-send the verification email.
                </a>
            </p>

            <Message
                v-if="verificationLinkSent"
                severity="success"
                class="shadow-sm mt-4"
                :closable="false"
            >
                A new verification link has been sent to your email address.
            </Message>
        </div>
        <div>
            <Button
                type="submit"
                label="Save"
                :loading="updating"
            />
        </div>
    </form>
</template>
