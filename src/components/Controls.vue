<script setup lang="ts">
import { reactive, watch } from "vue";
import type { IFrameControls } from "@/types";
import InputControl from "./InputControl.vue";

interface IState {
  imageLoaded: boolean;
  showFrameControls: boolean;
  frameControls: IFrameControls;
}

defineProps<{
  scale: number;
}>();

const emit = defineEmits<{
  (e: "imageLoaded", image: HTMLImageElement): void,
  (e: "updateScale", scale: number, controls: IFrameControls): void,
  (e: "showCreateFrames", state: boolean): void,
  (e: "dataUpdated", controls: IFrameControls): void,
  (e: "addFrames"): void,
}>();

const state: IState = reactive({
  imageLoaded: false,
  showFrameControls: false,
  frameControls: {
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
  },
});

watch(
  () => state.frameControls,
  (controls: IFrameControls) => {
    emit("dataUpdated", controls);
  },
  { deep: true },
);

function loadSpritesheet(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const img = new Image();
    img.addEventListener("load", function () {
      state.imageLoaded = true;
      emit("imageLoaded", img);
    });

    // Load file into img
    img.src = URL.createObjectURL(file);
  }
}

function updateScale(scale: number) {
  emit("updateScale", Number(scale), state.frameControls);
}

function createFrames() {
  state.showFrameControls = true;
  emit("showCreateFrames", true);
  emit("dataUpdated", state.frameControls);
}

function addFrames() {
  state.showFrameControls = false;
  emit("addFrames");
}

function cancel() {
  emit("showCreateFrames", false);
  state.showFrameControls = false;
}
</script>

<template>
  <div class="controls">
    <input type="file" @change="loadSpritesheet">
    <InputControl
      :modelValue="scale"
      label="Scale:"
      type="number"
      @update:modelValue="updateScale"
    />
    <hr>
    <button
      v-if="state.imageLoaded && !state.showFrameControls"
      class="btn"
      @click="createFrames">Create frames</button>
    <div v-if="state.showFrameControls" class="frame-controls">
      <InputControl
        v-model="state.frameControls.frameName"
        label="Name:"
      />
      <InputControl
        v-model.number="state.frameControls.amount"
        label="Amount:"
        type="number"
      />
      <InputControl
        v-model.number="state.frameControls.startOffset.x"
        label="Start X offset:"
        type="number"
      />
      <InputControl
        v-model.number="state.frameControls.startOffset.y"
        label="Start Y offset:"
        type="number"
      />
      <InputControl
        v-model.number="state.frameControls.spaceBetween.x"
        label="Horizontal padding:"
        type="number"
      />
      <InputControl
        v-model.number="state.frameControls.spaceBetween.y"
        label="Vertical padding:"
        type="number"
      />
      <InputControl
        v-model.number="state.frameControls.frameSize.width"
        label="Frame width:"
        type="number"
      />
      <InputControl
        v-model.number="state.frameControls.frameSize.height"
        label="Frame height:"
        type="number"
      />
      <div class="flex-break"></div>
      <button
        class="btn"
        @click="addFrames">Add</button>
      <button
        class="btn"
        @click="cancel">Cancel</button>
    </div>
  </div>
</template>

<style scoped>
  hr {
    margin: 6px 0;
    width: 100%;
  }

  .controls {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .controls .frame-controls {
    display: flex;
    flex-wrap: wrap;
  }
</style>
