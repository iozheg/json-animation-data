<script setup lang="ts">
defineProps(["modelValue", "label", "disabled"]);
defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="checkbox-control">
    <label :for="label">{{ label }}</label>
    <input
      :id="label"
      class="checkbox"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target?.checked)"
    >
  </div>
</template>

<style scoped>
  .checkbox-control {
    width: 134px;
    line-height: 1;
  }

  .checkbox-control label {
    vertical-align: top;
    padding-left: 2px;
    color: var(--text-gray);
  }

  .checkbox-control .checkbox {
    width: 15px;
    height: 15px;
    margin-left: 10px;
  }
</style>