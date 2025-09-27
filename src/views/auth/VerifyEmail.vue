<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useFlashMessage } from '@/composables/useFlashMessage.js'
import GuestAuthLayout from '@/layouts/GuestAuthLayout.vue'

const authStore = useAuthStore()
const { flashMessages } = useFlashMessage()

const verificationLinkSent = computed(() => flashMessages.success === 'verification-link-sent')

const submit = () => {
    authStore.sendVerificationEmail()
}
</script>

<template>
    <GuestAuthLayout>
        <template
            v-if="verificationLinkSent"
            #message
        >
            <Message
                severity="success"
                :closable="false"
                class="shadow-sm"
            >
                A new verification link has been sent to the email address you provided during registration.
            </Message>
        </template>

        <template #title>
            <div class="text-center">
                Verify email
            </div>
        </template>

        <template #subtitle>
            <div class="text-center">
                Please verify your email address by clicking on the link we just emailed to you.
            </div>
        </template>

        <form
            class="space-y-6 sm:space-y-8"
            @submit.prevent="submit"
        >
            <div>
                <Button
                    type="submit"
                    label="Resend verification email"
                    :loading="authStore.sendingVerificationEmail"
                    fluid
                />
            </div>

            <div class="text-center">
                <Button
                    class="p-0"
                    variant="link"
                    label="Log out"
                    @click="authStore.logout()"
                />
            </div>
        </form>
    </GuestAuthLayout>
</template>
