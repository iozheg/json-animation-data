<script setup lang="ts">
import { reactive } from "vue";
import type { IFramesForm } from "@/types";
import InputControl from "./InputControl.vue";
import CreateFramesForm from "./CreateFramesForm.vue";

interface IState {
  imageLoaded: boolean;
  showFrameControls: boolean;
}

defineProps<{
  scale: number;
}>();

const emit = defineEmits<{
  (e: "imageLoaded", image: HTMLImageElement): void,
  (e: "updateScale", scale: number): void,
  (e: "showCreateFrames", state: boolean): void,
  (e: "updateFramesForm", controls: IFramesForm): void,
  (e: "addFrames"): void,
}>();

const state: IState = reactive({
  imageLoaded: false,
  showFrameControls: false,
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

function createFrames() {
  state.showFrameControls = true;
  emit("showCreateFrames", true);
}

function updateFramesForm(form: IFramesForm) {
  emit("updateFramesForm", form);
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
      @click="createFrames"
    >Create frames</button>
    <CreateFramesForm
      v-if="state.showFrameControls"
      @update-form="updateFramesForm"
      @add-frames="addFrames"
      @cancel="cancel"
    />
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
</style>
