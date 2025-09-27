<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/stores/auth'
import { useAxiosForm } from '@/composables/useAxiosForm'
import { useFlashMessage } from '@/composables/useFlashMessage.js'
import AppLayout from '@/layouts/AppLayout.vue'
import SettingsLayout from '@/layouts/UserSettingsLayout.vue'
import DeleteUserModal from '@/components/DeleteUserModal.vue'
import InputErrors from '@/components/InputErrors.vue'

const breadcrumbs = [
    { label: 'Dashboard', route: { name: 'dashboard' } },
    { label: 'Profile settings' },
]

const toast = useToast()
const authStore = useAuthStore()
const { flashMessages } = useFlashMessage()

const verificationLinkSent = computed(() => flashMessages.success === 'verification-link-sent')
const deleteUserModalOpen = ref(false)

const {
    data: formData,
    validationErrors,
    processing: updating,
    patch: submitForm,
} = useAxiosForm({
    name: authStore.user?.name || '',
    email: authStore.user?.email || '',
})
const submit = () => {
    submitForm('/profile', {
        onSuccess: async () => {
            toast.add({
                severity: 'success',
                summary: 'Saved',
                detail: 'Profile information has been updated',
                life: 3000,
            })
            authStore.fetchUser()
        },
    })
}

const resendVerifyEmail = () => {
    authStore.sendVerificationEmail()
}
</script>

<template>
    <AppLayout :breadcrumbs>
        <SettingsLayout>
            <div class="space-y-4 md:space-y-8">
                <Card
                    pt:body:class="max-w-2xl space-y-3"
                    pt:caption:class="space-y-1"
                >
                    <template #title>
                        Profile information
                    </template>
                    <template #subtitle>
                        Update your name and email address
                    </template>
                    <template #content>
                        <form
                            class="space-y-6"
                            @submit.prevent="submit"
                        >
                            <div class="flex flex-col gap-2">
                                <label for="name">Name</label>
                                <InputText
                                    id="name"
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
                                <label for="email">Email address</label>
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

                            <div v-if="authStore.mustVerifyEmail && authStore.user?.email_verified_at === null">
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
                </Card>
                <Card
                    pt:body:class="max-w-2xl space-y-3"
                    pt:caption:class="space-y-1"
                >
                    <template #title>
                        Delete account
                    </template>
                    <template #subtitle>
                        Delete your account and all of its resources
                    </template>
                    <template #content>
                        <DeleteUserModal v-model="deleteUserModalOpen" />
                        <Message
                            severity="error"
                            pt:root:class="p-2"
                        >
                            <div class="flex flex-col gap-4">
                                <div>
                                    <div class="text-lg">
                                        Warning
                                    </div>
                                    <div class="">
                                        Please proceed with caution, this cannot be undone.
                                    </div>
                                </div>
                                <div>
                                    <Button
                                        label="Delete account"
                                        severity="danger"
                                        @click="deleteUserModalOpen = true"
                                    />
                                </div>
                            </div>
                        </Message>
                    </template>
                </Card>
            </div>
        </SettingsLayout>
    </AppLayout>
</template>
