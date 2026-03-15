<template>
  <button
    class="ui-button"
    :class="[variant, size]"
    :disabled="disabled || loading"
    :type="type"
    @click="$emit('click')"
  >
    <span v-if="loading" class="spinner"></span>
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: "primary"
  },
  type: {
    type: String,
    default: "button"
  },
  size: {
    type: String,
    default: "md"
  },
  disabled: Boolean,
  loading: Boolean
});

defineEmits(["click"]);
</script>

<style scoped>
.ui-button {
  border: 1px solid transparent;
  padding: 0.75em 1em;
  border-radius: 0.4em;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.15s ease, filter 0.15s ease;
}

.ui-button.primary {
  background: var(--brand);
  color: #fff;
}

.ui-button.success {
  background: var(--brand);
  color: #fff;
}

.ui-button.secondary {
  background: #e2e8f0;
  color: #1e293b;
}

.ui-button.danger {
  background: #dc2626;
  color: #fff;
}

.ui-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.ui-button:active {
  filter: brightness(1.2);
  transform: none;
}

.ui-button:focus {
  outline: none;
}

.ui-button.sm {
  padding: 0.6em 0.9em;
}

.spinner {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
