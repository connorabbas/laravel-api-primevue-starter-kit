<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useFlashMessage } from '@/composables/useFlashMessage.js';
import GuestLayout from '@/layouts/GuestLayout.vue';

const authStore = useAuthStore();
const { flashMessages } = useFlashMessage();

const verificationLinkSent = computed(() => flashMessages.success === 'verification-link-sent');

const submit = () => {
    authStore.sendVerificationEmail();
};
</script>

<template>
    <GuestLayout>
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

        <div class="mb-6 text-sm text-muted-color">
            Thanks for signing up! Before getting started, could you verify your email address by clicking on the link
            we just emailed to you? If you didn't receive the email, we will gladly send you another.
        </div>

        <form @submit.prevent="submit">
            <div class="mt-6 flex justify-between items-center">
                <Button
                    type="submit"
                    label="Resend Verification Email"
                    :loading="authStore.sendingVerificationEmail"
                />
                <a
                    href="#"
                    class="underline text-muted-color hover:text-color"
                    @click="authStore.logout()"
                >
                    Log Out
                </a>
            </div>
        </form>
    </GuestLayout>
</template>
