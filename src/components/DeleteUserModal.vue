<script setup>
import { useTemplateRef } from 'vue';

const modalOpen = defineModel(false, {
    type: Boolean,
});
const passwordInput = useTemplateRef('password-input');

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
       
    </Dialog>
</template>
