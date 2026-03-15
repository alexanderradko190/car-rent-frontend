<template>
  <div v-if="visible" class="modal-message" :class="type">
    <div class="modal-content">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
  message: String,
  type: {
    type: String,
    default: "success"
  }
});
</script>

<style scoped>
.modal-message {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}

.modal-content {
  width: 300px;
  height: 200px;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 10px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.2);
  border: 2px solid transparent;
  font-size: 16px;
}

.modal-message.success .modal-content {
  border-color: #16a34a;
}

.modal-message.error .modal-content {
  border-color: #dc2626;
}
</style>
