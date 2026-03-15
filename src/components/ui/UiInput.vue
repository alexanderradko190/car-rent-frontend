<template>
  <label class="ui-input">
    <span v-if="label" class="label">{{ label }}</span>
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :required="required"
      :min="min"
      :max="max"
      :step="step"
      :class="{ error }"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </label>
</template>

<script setup>
defineProps({
  label: String,
  modelValue: [String, Number],
  type: {
    type: String,
    default: "text"
  },
  placeholder: String,
  required: Boolean,
  min: [String, Number],
  max: [String, Number],
  step: [String, Number],
  error: Boolean
});

defineEmits(["update:modelValue"]);
</script>

<style scoped>
.ui-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
}

.ui-input input {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #d0d7e2;
  font-size: 14px;
}

.ui-input input.error {
  border-color: #dc2626;
}

.label {
  font-weight: 600;
}
</style>
