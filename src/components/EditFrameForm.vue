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
  <div class="edit-frame-form">
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
    <div class="btn-group">
      <button
        class="btn"
        @click="save">Save</button>
      <button
        class="btn"
        @click="cancel">Cancel</button>
    </div>
  </div>
</template>

<style scoped>
  .edit-frame-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 20px;
    padding: 6px 0;
    border-top: 1px solid var(--color-accent);
    background-color: var(--color-bkgnd-component);
  }
</style>
