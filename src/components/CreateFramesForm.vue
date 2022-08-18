<script setup lang="ts">
import { onMounted, reactive, watch } from "vue";
import type { IFramesForm } from "@/types";
import InputControl from "./InputControl.vue";

const emit = defineEmits<{
  (e: "updateForm", controls: IFramesForm): void,
  (e: "addFrames"): void,
  (e: "cancel"): void,
}>();

const state: IFramesForm = reactive({
  amount: 1,
  startOffset: {
    x: 0,
    y: 0,
  },
  spaceBetween: {
    x: 0,
    y: 0,
  },
  frameSize: {
    width: 16,
    height: 16,
  },
  frameName: "frame",
});

onMounted(() => {
  emit("updateForm", state);
});

watch(
  () => state,
  (newState: IFramesForm) => {
    emit("updateForm", newState);
  },
  { deep: true },
);

function addFrames() {
  emit("addFrames");
}

function cancel() {
  emit("cancel");
}
</script>

<template>
  <div class="frame-form">
    <InputControl
      v-model="state.frameName"
      label="Name:"
    />
    <InputControl
      v-model.number="state.amount"
      label="Amount:"
      type="number"
    />
    <InputControl
      v-model.number="state.startOffset.x"
      label="Start X offset:"
      type="number"
    />
    <InputControl
      v-model.number="state.startOffset.y"
      label="Start Y offset:"
      type="number"
    />
    <InputControl
      v-model.number="state.spaceBetween.x"
      label="Horizontal padding:"
      type="number"
    />
    <InputControl
      v-model.number="state.spaceBetween.y"
      label="Vertical padding:"
      type="number"
    />
    <InputControl
      v-model.number="state.frameSize.width"
      label="Frame width:"
      type="number"
    />
    <InputControl
      v-model.number="state.frameSize.height"
      label="Frame height:"
      type="number"
    />
    <div class="flex-break"></div>
    <div class="btn-group">
      <button
        class="btn"
        @click="addFrames"
      >Add</button>
      <button
        class="btn"
        @click="cancel"
      >Cancel</button>
    </div>
  </div>
</template>

<style scoped>
  .frame-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
</style>
