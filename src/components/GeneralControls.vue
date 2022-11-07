<script setup lang="ts">
import InputControl from "./InputControl.vue";
import Information from "./Information.vue";
import strings from "@/strings";
import CheckboxControl from "./CheckboxControl.vue";

defineProps<{
  scale: number;
  readyToExport: boolean;
  showGrid: boolean;
}>();

const emit = defineEmits<{
  (e: "imageLoaded", image: HTMLImageElement, fileName: string): void,
  (e: "updateScale", scale: number): void,
  (e: "toggleGrid", showGrid: boolean): void,
  (e: "exportJson"): void,
}>();

function loadSpritesheet(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const img = new Image();
    img.addEventListener("load", function () {
      emit("imageLoaded", img, file.name);
    });

    // Load file into img
    img.src = URL.createObjectURL(file);
  }
}

function updateScale(scale: number) {
  emit("updateScale", Number(scale));
}

function toggleGrid(showGrid: boolean) {
  emit("toggleGrid", showGrid);
}

function exportJson() {
  emit("exportJson");
}
</script>

<template>
  <div class="general-controls">
    <Information :text="strings.instructions" class="instruction-info" />
    <input type="file" @change="loadSpritesheet">
    <button
      :disabled="!readyToExport"
      class="btn export-btn"
      @click="exportJson"
    >Export JSON</button>
    <div class="canvas-controls">
      <InputControl
        :modelValue="scale"
        class="main-button"
        label="Scale:"
        type="number"
        @update:modelValue="updateScale"
      />
      <CheckboxControl
        :modelValue="showGrid"
        class="main-button grid-switch"
        label="Show grid"
        type="checkbox"
        @update:modelValue="toggleGrid"
      />
    </div>
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

  .general-controls .canvas-controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
  }

  .general-controls .grid-switch {
    align-self: center;
  }
</style>
