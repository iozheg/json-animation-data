<script setup lang="ts">
import { reactive, ref } from "vue";
import type { IFrameOptions } from "@/types";
import InputControl from "./InputControl.vue";

defineProps<{
  frames: IFrameOptions[],
}>();

const emit = defineEmits<{
  (e: "selectFrames", frameIndexes: number[]): void,
  (e: "addAnimation", name: string, frameIndexes: number[]): void,
  (e: "cancel"): void,
}>();

const state = reactive({
  animationName: "animation",
  frameIndexes: <number[]>[],
});

const availableList = ref<HTMLSelectElement | null>(null);
const selectedList = ref<HTMLSelectElement | null>(null);

function selectFrames() {
  const newSelected = Array.from((availableList.value as HTMLSelectElement).selectedOptions);
  state.frameIndexes.push(...newSelected.map(item => Number(item.value)));
  
  emit("selectFrames", state.frameIndexes);
}

function unselectFrames() {
  const newSelected = Array.from((selectedList.value as HTMLSelectElement).selectedOptions);
  newSelected.map(item => Number(item.value))
    .forEach(index => state.frameIndexes.splice(index, 1));
  
  emit("selectFrames", state.frameIndexes);
}

function addAnimation() {
  emit("addAnimation", state.animationName, state.frameIndexes);
}

function cancel() {
  emit("cancel");
}
</script>

<template>
  <div class="animation-form">
    <InputControl
      v-model="state.animationName"
      label="Name:"
    />
    <div class="flex-break"></div>
    <div class="frame-selector">
      <div class="frame-list">
        <div class="frame-list__name">Available frames:</div>
        <div class="frame-list__list">
          <select ref="availableList" name="" id="" multiple>
            <option v-for="(frame, index) in frames" :value="index">
              {{ frame.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="frame-selector-buttons">
        <button class="btn frame-selector-buttons__button" @click="selectFrames">&gt;</button>
        <button class="btn frame-selector-buttons__button" @click="unselectFrames">&lt;</button>
      </div>
      <div class="frame-list">
        <div class="frame-list__name">Selected frames:</div>
        <div class="frame-list__list">
          <select ref="selectedList" name="" id="" multiple>
            <option v-for="(frameIndex, index) in state.frameIndexes" :value="index">
              {{ frames[frameIndex].name }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="flex-break"></div>
    <div class="btn-group">
      <button
        class="btn"
        @click="addAnimation"
      >Add</button>
      <button
        class="btn"
        @click="cancel"
      >Cancel</button>
    </div>
  </div>
</template>

<style scoped>
  .animation-form {
    display: flex;
    flex-wrap: wrap;
  }

  .frame-selector {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .frame-selector .frame-list .frame-list__name {
    font-size: 14px;
  }

  .frame-list__list select {
    width: 120px;
    height: 150px;
    background-color: var(--color-bkgnd-component);
  }

  .frame-list__list select option {
    margin-bottom: 3px;
    color: var(--color-text);
    font-size: 14px;
  }

  .frame-list__list select option:hover {
    background-color: var(--color-bkgnd-item-hover);
  }

  .frame-list__list select option:checked {
    background-color: var(--color-bkgnd-item-selected);
  }

  .frame-list__list select option:focus {
    background-color: var(--color-bkgnd-item-selected);
  }

  .frame-selector-buttons {
    display: flex;
    flex-direction: column;
    align-self: center;
  }

  .frame-selector-buttons .frame-selector-buttons__button {
    width: 20px;
    height: 20px;
    margin: 3px 0;
    line-height: 1;
  }
</style>
