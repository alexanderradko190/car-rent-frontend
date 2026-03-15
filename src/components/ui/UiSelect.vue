<template>
  <label class="ui-select">
    <span v-if="label" class="label">{{ label }}</span>
    <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </label>
</template>

<script setup>
defineProps({
  label: String,
  modelValue: [String, Number],
  options: {
    type: Array,
    default: () => []
  }
});

defineEmits(["update:modelValue"]);
</script>

<style scoped>
.ui-select {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
}

.ui-select select {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #d0d7e2;
  font-size: 14px;
  background: #fff;
}

.label {
  font-weight: 600;
}
</style>
