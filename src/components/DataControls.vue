<script setup lang="ts">
import type { IFrameOptions, IFramesForm } from "@/types";
import CreateFramesForm from "./CreateFramesForm.vue";
import CreateAnimationForm from "./CreateAnimationForm.vue";
import { ControlView } from "@/enums";

defineProps<{
  frames: IFrameOptions[];
  controlView: ControlView;
}>();

const emit = defineEmits<{
  (e: "showControlView", view: ControlView): void,
  (e: "updateFramesForm", controls: IFramesForm): void,
  (e: "addFrames"): void,
  (e: "selectFrames", frameNames: string[]): void,
  (e: "addAnimation", name: string, frameNames: string[]): void,
}>();

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

function selectAnimationFrames(frameNames: string[]) {
  emit("selectFrames", frameNames);
}

function addAnimation(name: string, frameNames: string[]) {
  emit("addAnimation", name, frameNames);
  emit("showControlView", ControlView.NONE);
}
</script>

<template>
  <div class="data-controls">
    <div class="buttons">
      <button
        :disabled="controlView !== ControlView.NONE"
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
  .data-controls {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .data-controls .buttons {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .data-controls .create-form {
    margin-top: 30px;
  }
</style>
