<script setup lang="ts">
defineProps(["modelValue", "label", "type", "placeholder", "disabled"]);
defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="input-control">
    <label :for="label">{{ label }}</label>
    <input
      :id="label"
      class="input"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target?.value)"
    >
  </div>
</template>

<style scoped>
  .input-control {
    line-height: 1;
  }

  .input-control label {
    padding-left: 2px;
    padding-bottom: 3px;
    color: var(--text-gray);
  }
</style>