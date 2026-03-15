<template>
  <div class="auth-wrapper">
    <UiAlert
      :visible="notification.visible"
      :message="notification.message"
      :type="notification.type"
    />
    <div class="auth-card">
      <h1 class="title">{{ title }}</h1>
      <slot />
    </div>
  </div>
</template>

<script setup>
import UiAlert from "../ui/UiAlert.vue";
import { notificationStore } from "../../store/notificationStore";

defineProps({
  title: String
});

const notification = notificationStore.state;
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
}

.title {
  margin-top: 0;
}
</style>
