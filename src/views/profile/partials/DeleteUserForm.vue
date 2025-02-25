<script setup>
import { ref, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';
import { useAxiosForm } from '@/composables/useAxiosForm';
import { useFlashMessage } from '@/composables/useFlashMessage.js';
import InputErrors from '@/components/InputErrors.vue';

const router = useRouter();
const { setFlashMessage } = useFlashMessage();

const passwordInput = useTemplateRef('password-input');
const modalOpen = ref(false);

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
            router.push({ name: 'dashboard' }).then(() => {
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
    <section>
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
                    Once your account is deleted, all of its resources and data will be permanently deleted. Please
                    enter your password to confirm you would like to permanently delete your account.
                </p>
            </div>

            <div class="flex flex-col gap-2">
                <InputText
                    id="password"
                    ref="password-input"
                    v-model="formData.password"
                    type="password"
                    placeholder="Password"
                    class="w-full"
                    :invalid="Boolean(validationErrors?.password)"
                    autocomplete="current-password"
                    autofocus
                    required
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
                    label="Delete Account"
                    severity="danger"
                    :loading="deleting"
                    @click="deleteAccount"
                />
            </template>
        </Dialog>

        <Button
            label="Delete Account"
            severity="danger"
            @click="modalOpen = true"
        />
    </section>
</template>
