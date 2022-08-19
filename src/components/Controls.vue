<script setup lang="ts">
import { reactive } from "vue";
import type { IFrameOptions, IFramesForm } from "@/types";
import InputControl from "./InputControl.vue";
import CreateFramesForm from "./CreateFramesForm.vue";
import CreateAnimationForm from "./CreateAnimationForm.vue";
import { ControlView } from "@/enums";

interface IState {
  imageLoaded: boolean;
}

defineProps<{
  scale: number;
  frames: IFrameOptions[];
  controlView: ControlView;
}>();

const emit = defineEmits<{
  (e: "imageLoaded", image: HTMLImageElement): void,
  (e: "updateScale", scale: number): void,
  (e: "showControlView", view: ControlView): void,
  (e: "updateFramesForm", controls: IFramesForm): void,
  (e: "addFrames"): void,
  (e: "selectFrames", frameIndexes: number[]): void,
  (e: "addAnimation", name: string, frameIndexes: number[]): void,
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

function createFrames() {
  emit("showControlView", ControlView.CREATE_FRAMES);
}

function createAnimation() {
  emit("showControlView", ControlView.CREATE_ANIMATION);
}

function updateFramesForm(form: IFramesForm) {
  emit("updateFramesForm", form);
}

function addFrames() {
  emit("addFrames");
  emit("showControlView", ControlView.NONE);
}

function cancel() {
  emit("showControlView", ControlView.NONE);
}

function selectAnimationFrames(frameIndexes: number[]) {
  emit("selectFrames", frameIndexes);
}

function addAnimation(name: string, frameIndexes: number[]) {
  emit("addAnimation", name, frameIndexes);
  emit("showControlView", ControlView.NONE);
}
</script>

<template>
  <div class="controls">
    <input type="file" @change="loadSpritesheet">
    <InputControl
      :modelValue="scale"
      class="main-button"
      label="Scale:"
      type="number"
      @update:modelValue="updateScale"
    />
    <hr>
    <div class="buttons">
      <button
        :disabled="!state.imageLoaded || controlView !== ControlView.NONE"
        class="btn btn-w"
        @click="createFrames"
      >Create frames</button>
      <button
        :disabled="!frames.length || controlView !== ControlView.NONE"
        class="btn btn-w"
        @click="createAnimation"
      >Create animation</button>
    </div>
    <CreateFramesForm
      v-if="controlView === ControlView.CREATE_FRAMES"
      class="create-form"
      @update-form="updateFramesForm"
      @add-frames="addFrames"
      @cancel="cancel"
    />
    <CreateAnimationForm
      class="create-form"
      v-if="controlView === ControlView.CREATE_ANIMATION"
      :frames="frames"
      @select-frames="selectAnimationFrames"
      @add-animation="addAnimation"
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

  .controls .main-button {
    margin-top: 10px;
  }

  .controls .buttons {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .controls .create-form {
    margin-top: 30px;
  }
</style>
