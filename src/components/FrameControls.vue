<script setup lang="ts">
import type { IFrameOptions } from "@/types";
import InputControl from "./InputControl.vue";

const props = defineProps<{
  frame: IFrameOptions;
}>();

const emit = defineEmits<{
  (e: "update", frame: IFrameOptions): void,
  (e: "save", frame: IFrameOptions): void,
  (e: "cancel"): void,
}>();

function update(field: string, value: unknown) {
  emit("update", { ...props.frame, [field]: value });
}

function save() {
  emit("save", props.frame);
}

function cancel() {
  emit("cancel");
}
</script>

<template>
  <div class="frame-controls">
    <InputControl
      :modelValue="frame.name"
      label="Name:"
      @update:modelValue="update('name', $event)"
    />
    <div class="flex-break"></div>
    <InputControl
      :modelValue="frame.x"
      label="x:"
      type="number"
      @update:modelValue="update('x', $event)"
    />
    <InputControl
      :modelValue="frame.y"
      label="y:"
      type="number"
      @update:modelValue="update('y', $event)"
    />
    <InputControl
      :modelValue="frame.width"
      label="Width:"
      type="number"
      @update:modelValue="update('width', $event)"
    />
    <InputControl
      :modelValue="frame.height"
      label="Height:"
      type="number"
      @update:modelValue="update('height', $event)"
    />
    <div class="flex-break"></div>
    <button
      class="btn"
      @click="save">Save</button>
    <button
      class="btn"
      @click="cancel">Cancel</button>
  </div>
</template>

<style scoped>
  .frame-controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 10px;
    margin-top: 6px;
    background-color: #333333;
  }
</style>
