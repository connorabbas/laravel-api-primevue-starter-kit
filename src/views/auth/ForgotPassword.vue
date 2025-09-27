<script setup lang="ts">
import { useTemplateRef, computed, onMounted } from 'vue'
import { useAxiosForm } from '@/composables/useAxiosForm'
import { useAuthStore } from '@/stores/auth'
import { useFlashMessage } from '@/composables/useFlashMessage.js'
import InputText from 'primevue/inputtext'
import GuestAuthLayout from '@/layouts/GuestAuthLayout.vue'
import InputErrors from '@/components/InputErrors.vue'

const authStore = useAuthStore()
const { flashMessages, setFlashMessage } = useFlashMessage()

type InputTextType = InstanceType<typeof InputText> & { $el: HTMLElement };
const emailInput = useTemplateRef<InputTextType>('email-input')

const {
    data: formData,
    validationErrors,
    processing: submittingRequest,
    post: submitForm,
} = useAxiosForm({
    email: '',
})
const submit = () => {
    authStore.fetchCsrfCookie().then(() => {
        submitForm('/forgot-password', {
            onSuccess: (response) => {
                setFlashMessage('success', response.data.status)
            },
        })
    })
}

const loading = computed(() => {
    return submittingRequest.value || authStore.fetchingCsrfToken || authStore.fetchingUser
})

onMounted(() => {
    if (emailInput.value) {
        emailInput.value.$el.focus()
    }
})
</script>

<template>
    <GuestAuthLayout>
        <template
            v-if="flashMessages.success"
            #message
        >
            <Message
                severity="success"
                :closable="false"
                class="shadow-sm"
            >
                {{ flashMessages.success }}
            </Message>
        </template>

        <template #title>
            <div class="text-center">
                Forgot password
            </div>
        </template>

        <template #subtitle>
            <div class="text-center">
                Enter your email address to receive a password reset link
            </div>
        </template>

        <form
            class="space-y-6 sm:space-y-8"
            @submit.prevent="submit"
        >
            <div class="flex flex-col gap-2">
                <label for="email">Email address</label>
                <InputText
                    id="email"
                    ref="email-input"
                    v-model="formData.email"
                    :invalid="Boolean(validationErrors?.email)"
                    type="email"
                    autocomplete="username"
                    required
                    fluid
                />
                <InputErrors :errors="validationErrors?.email" />
            </div>

            <div>
                <Button
                    type="submit"
                    label="Email password reset link"
                    :loading="loading"
                    fluid
                />
            </div>

            <div class="text-center">
                <span class="text-muted-color mr-1">Or, return to</span>
                <RouterLink :to="{ name: 'login' }">
                    <Button
                        class="p-0"
                        variant="link"
                        label="log in"
                    />
                </RouterLink>
            </div>
        </form>
    </GuestAuthLayout>
</template>
