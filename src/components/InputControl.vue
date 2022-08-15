<script setup lang="ts">
defineProps(["modelValue", "label", "type", "placeholder"]);
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
      @input="$emit('update:modelValue', $event.target?.value)"
    >
  </div>
</template>