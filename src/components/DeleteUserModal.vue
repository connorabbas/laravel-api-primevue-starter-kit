<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useAxiosForm } from '@/composables/useAxiosForm';
import { useFlashMessage } from '@/composables/useFlashMessage.js';
import Password from 'primevue/password';
import InputErrors from '@/components/InputErrors.vue';

const modalOpen = defineModel<boolean>({ default: false });

const authStore = useAuthStore();
const router = useRouter();
const { setFlashMessage } = useFlashMessage();

type PasswordInputType = InstanceType<typeof Password> & { $el: HTMLElement };
const passwordInput = useTemplateRef<PasswordInputType>('password-input');

const {
    data: formData,
    validationErrors,
    processing: deleting,
    del: submitForm,
    reset: resetFormFields,
} = useAxiosForm({
    password: '',
});
const deleteAccount = () => {
    submitForm('/profile', {
        onSuccess: () => {
            modalOpen.value = false;
            authStore.user = null;
            router.push({ name: 'login' }).then(() => {
                setFlashMessage('success', 'Your account has been deleted.');
            });
        },
        onError: () => {
            console.error('error');
            if (passwordInput.value && passwordInput.value?.$el) {
                const passwordInputElement = passwordInput.value.$el.querySelector('input');
                passwordInputElement?.focus();
            }
        },
        onFinish: () => resetFormFields(),
    });
};
</script>

<template>
    <Dialog
        v-model:visible="modalOpen"
        class="w-[40rem]"
        position="center"
        header="Are you sure you want to delete your account?"
        :draggable="false"
        dismissableMask
        modal
    >
        <div class="mb-6">
            <p class="m-0 text-muted-color">
                Once your account is deleted, all of its resources and data
                will be permanently deleted. Please enter your password to
                confirm you would like to permanently delete your account.
            </p>
        </div>

        <div class="flex flex-col gap-2">
            <Password
                ref="password-input"
                v-model="formData.password"
                :invalid="Boolean(validationErrors?.password)"
                placeholder="Password"
                autocomplete="current-password"
                inputId="password"
                :feedback="false"
                toggleMask
                autofocus
                required
                fluid
                @keyup.enter="deleteAccount"
            />
            <InputErrors :errors="validationErrors?.password" />
        </div>

        <template #footer>
            <Button
                class="mr-2"
                label="Cancel"
                plain
                text
                @click="modalOpen = false"
            />
            <Button
                :loading="deleting"
                label="Delete account"
                severity="danger"
                @click="deleteAccount"
            />
        </template>
    </Dialog>
</template>
