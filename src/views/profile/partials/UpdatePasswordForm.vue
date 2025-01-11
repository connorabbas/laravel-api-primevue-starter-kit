<script setup>
import { useTemplateRef } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useAxiosForm } from '@/composables/useAxiosForm';
import { useAuthStore } from '@/stores/auth';
import InputErrors from '@/components/InputErrors.vue';

const toast = useToast();
const authStore = useAuthStore();

const currentPasswordInput = useTemplateRef('current-password-input');
const newPasswordInput = useTemplateRef('new-password-input');

const {
    data: formData,
    validationErrors,
    processing: updating,
    put: submitForm,
    reset: resetFormFields,
} = useAxiosForm({
    current_password: '',
    password: '',
    password_confirmation: '',
});

const submit = () => {
    submitForm('/password', {
        onSuccess: async () => {
            toast.add({
                severity: 'success',
                summary: 'Saved',
                detail: 'Your password has been updated',
                life: 3000,
            });
            resetFormFields();
            authStore.fetchUser();
        },
        onError: () => {
            if (validationErrors.value?.password) {
                resetFormFields('password', 'password_confirmation');
                newPasswordInput.value.$el.focus();
            }
            if (validationErrors.value?.current_password) {
                resetFormFields('current_password');
                currentPasswordInput.value.$el.focus();
            }
        },
    });
};
</script>

<template>
    <form
        @submit.prevent="submit"
        class="space-y-6"
    >
        <div class="space-y-2">
            <label for="current_password">Current Password</label>
            <InputText
                required
                id="current_password"
                ref="current-password-input"
                type="password"
                v-model="formData.current_password"
                class="w-full"
                :invalid="Boolean(validationErrors?.current_password)"
                autocomplete="current-password"
            />
            <InputErrors :errors="validationErrors?.current_password" />
        </div>

        <div class="space-y-2">
            <label for="password">New Password</label>
            <InputText
                required
                id="password"
                ref="new-password-input"
                type="password"
                v-model="formData.password"
                class="w-full"
                :invalid="Boolean(validationErrors?.password)"
                autocomplete="new-password"
            />
            <InputErrors :errors="validationErrors?.password" />
        </div>

        <div class="space-y-2">
            <label for="password_confirmation">Confirm Password</label>
            <InputText
                required
                id="password_confirmation"
                type="password"
                v-model="formData.password_confirmation"
                class="w-full"
                :invalid="Boolean(validationErrors?.password_confirmation)"
                autocomplete="new-password"
            />
            <InputErrors :errors="validationErrors?.password_confirmation" />
        </div>

        <div class="flex items-center gap-4">
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
