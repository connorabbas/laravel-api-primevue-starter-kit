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
            await authStore.fetchUser();
            toast.add({
                severity: 'success',
                summary: 'Saved',
                detail: 'Profile information has been updated',
                life: 3000,
            });
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
        @submit.prevent="submit"
        class="space-y-6"
    >
        <div class="space-y-2">
            <label for="name">Name</label>
            <InputText
                required
                ref="name-input"
                id="name"
                type="text"
                v-model="formData.name"
                class="w-full"
                :invalid="Boolean(validationErrors?.name)"
                autocomplete="name"
            />
            <InputErrors :errors="validationErrors?.name" />
        </div>
        <div class="space-y-2">
            <label for="email">Email</label>
            <InputText
                required
                id="email"
                type="email"
                v-model="formData.email"
                class="w-full"
                :invalid="Boolean(validationErrors?.email)"
                autocomplete="username"
            />
            <InputErrors :errors="validationErrors?.email" />
        </div>

        <div v-if="authStore.mustVerifyEmail && authStore.user.email_verified_at === null">
            <p class="text-sm mt-2">
                Your email address is unverified.
                <a
                    href="#"
                    @click="resendVerifyEmail"
                    class="text-sm underline text-muted-color hover:text-color"
                >
                    Click here to re-send the verification email.
                </a>
            </p>

            <Message
                v-if="verificationLinkSent"
                severity="success"
                :closable="false"
                class="shadow mt-4"
            >
                A new verification link has been sent to your email address.
            </Message>
        </div>
        <div>
            <Button
                raised
                type="submit"
                :loading="updating"
                label="Save"
                severity="contrast"
            />
        </div>
    </form>
</template>
