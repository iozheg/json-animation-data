<script setup lang="ts">
import { reactive, watch } from "vue";
import type { IFrameOptions } from "@/types";
import InputControl from "./InputControl.vue";

const props = defineProps<{
  frame: IFrameOptions;
}>();

const emit = defineEmits<{
  (e: "update", frame: IFrameOptions): void,
  (e: "save", frame: IFrameOptions): void,
}>();

const state: IFrameOptions = reactive({
  ...props.frame,
});

watch(
  () => state,
  () => emit("update", state),
  { deep: true }
);

function save() {
  emit("save", state);
}
</script>

<template>
  <div class="frame-controls">
    <InputControl
      v-model="state.name"
      label="Name:"
    />
    <div class="flex-break"></div>
    <InputControl
      v-model.number="state.x"
      label="x:"
      type="number"
    />
    <InputControl
      v-model.number="state.y"
      label="y:"
      type="number"
    />
    <InputControl
      v-model.number="state.width"
      label="Width:"
      type="number"
    />
    <InputControl
      v-model.number="state.height"
      label="Height:"
      type="number"
    />
    <div class="flex-break"></div>
    <button
      class="btn"
      @click="save">save</button>
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
