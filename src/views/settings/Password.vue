<script setup>
import { useTemplateRef } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/stores/auth';
import { useAxiosForm } from '@/composables/useAxiosForm';
import Password from 'primevue/password';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/UserSettingsLayout.vue';
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
    <AppLayout>
        <SettingsLayout>
            <Card
                pt:body:class="max-w-2xl space-y-3"
                pt:caption:class="space-y-1"
            >
                <template #title>Update Password</template>
                <template #subtitle>
                    Ensure your account is using a long, random password to stay secure
                </template>
                <template #content>
                    <form
                        class="space-y-6"
                        @submit.prevent="submit"
                    >
                        <div class="flex flex-col gap-2">
                            <label for="current_password">Current Password</label>
                            <InputText
                                id="current_password"
                                ref="current-password-input"
                                v-model="formData.current_password"
                                :invalid="Boolean(validationErrors?.current_password)"
                                type="password"
                                autocomplete="current-password"
                                required
                                fluid
                            />
                            <InputErrors :errors="validationErrors?.current_password" />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label for="password">New Password</label>
                            <Password
                                id="password"
                                ref="new-password-input"
                                v-model="formData.password"
                                :invalid="Boolean(validationErrors?.password)"
                                autocomplete="new-password"
                                toggleMask
                                required
                                fluid
                            />
                            <InputErrors :errors="validationErrors?.password" />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label for="password_confirmation">Confirm Password</label>
                            <InputText
                                id="password_confirmation"
                                v-model="formData.password_confirmation"
                                :invalid="Boolean(validationErrors?.password_confirmation)"
                                type="password"
                                autocomplete="confirm-password"
                                required
                                fluid
                            />
                            <InputErrors :errors="validationErrors?.password_confirmation" />
                        </div>

                        <div class="flex items-center gap-4">
                            <Button
                                type="submit"
                                label="Save"
                                :loading="updating"
                            />
                        </div>
                    </form>
                </template>
            </Card>
        </SettingsLayout>
    </AppLayout>
</template>
