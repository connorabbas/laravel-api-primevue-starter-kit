<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/UserSettingsLayout.vue';
import DeleteUserModal from '@/components/DeleteUserModal.vue';

const deleteUserModalOpen = ref(false);
</script>

<template>
    <AppLayout>
        <InertiaHead title="Profile Settings" />

        <SettingsLayout>
            <div class="space-y-4 md:space-y-8">
                <Card
                    pt:body:class="max-w-2xl space-y-3"
                    pt:caption:class="space-y-1"
                >
                    <template #title>Profile Information</template>
                    <template #subtitle>
                        Update your name and email address
                    </template>
                    <template #content>
                    
                    </template>
                </Card>
                <Card
                    pt:body:class="max-w-2xl space-y-3"
                    pt:caption:class="space-y-1"
                >
                    <template #title>Delete Account</template>
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
                                    <div class="text-lg">Warning</div>
                                    <div class="">Please proceed with caution, this cannot be undone.</div>
                                </div>
                                <div>
                                    <Button
                                        label="Delete Account"
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
