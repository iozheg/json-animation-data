<script setup lang="ts">
import { reactive } from "vue";
import type { IFrameOptions } from "@/types";
import InputControl from "./InputControl.vue";
import Information from "./Information.vue";
import strings from "@/strings";

interface IState {
  imageLoaded: boolean;
}

defineProps<{
  scale: number;
  readyToExport: boolean;
}>();

const emit = defineEmits<{
  (e: "imageLoaded", image: HTMLImageElement): void,
  (e: "updateScale", scale: number): void,
}>();

const state: IState = reactive({
  imageLoaded: false,
});

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
  emit("updateScale", Number(scale));
}
</script>

<template>
  <div class="general-controls">
    <Information :text="strings.instructions" class="instruction-info" />
    <input type="file" @change="loadSpritesheet">
    <button :disabled="!readyToExport" class="btn export-btn">Export JSON</button>
    <InputControl
      :modelValue="scale"
      class="main-button"
      label="Scale:"
      type="number"
      @update:modelValue="updateScale"
    />
    <hr>
  </div>
</template>

<style scoped>
  hr {
    margin: 6px 0;
    width: 100%;
  }

  .general-controls {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .general-controls .instruction-info {
    margin-bottom: 20px;
  }

  .general-controls .export-btn {
    margin: 10px 0;
  }

  .general-controls .main-button {
    margin-top: 10px;
  }
</style>
