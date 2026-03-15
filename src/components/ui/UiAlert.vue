<template>
  <div v-if="visible" class="ui-alert" :class="type">
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
  message: String,
  type: {
    type: String,
    default: "info"
  }
});
</script>

<style scoped>
.ui-alert {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 16px;
  border-radius: 8px;
  background: #f0f2f6;
  color: #1b1f24;
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.15);
  z-index: 2000;
  max-width: 320px;
}

.ui-alert.success {
  background: #dcfce7;
  color: #166534;
}

.ui-alert.error {
  background: #fee2e2;
  color: #991b1b;
}
</style>
