<script setup>
import { useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useAxiosForm } from '@/composables/useAxiosForm';
import { useFlashMessage } from '@/composables/useFlashMessage.js';
import InputErrors from '@/components/InputErrors.vue';

const modalOpen = defineModel(false, {
    type: Boolean,
});

const authStore = useAuthStore();
const router = useRouter();
const { setFlashMessage } = useFlashMessage();

const passwordInput = useTemplateRef('password-input');

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
        onError: () => passwordInput.value.$el.focus(),
        onFinish: () => resetFormFields(),
    });
};

function focusPasswordInput() {
    passwordInput.value.$el.focus();
}
</script>

<template>
    <Dialog
        v-model:visible="modalOpen"
        position="center"
        header="Are you sure you want to delete your account?"
        :style="{ width: '40rem' }"
        :draggable="false"
        dismissableMask
        modal
        @show="focusPasswordInput"
    >
        <div class="mb-6">
            <p class="m-0 text-muted-color">
                Once your account is deleted, all of its resources and data
                will be permanently deleted. Please enter your password to
                confirm you would like to permanently delete your account.
            </p>
        </div>

        <div class="flex flex-col gap-2">
            <InputText
                id="password"
                ref="password-input"
                v-model="formData.password"
                :invalid="Boolean(validationErrors?.password)"
                type="password"
                placeholder="Password"
                autocomplete="current-password"
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
                label="Delete Account"
                severity="danger"
                @click="deleteAccount"
            />
        </template>
    </Dialog>
</template>
