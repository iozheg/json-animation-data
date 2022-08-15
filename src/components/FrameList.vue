<script setup lang="ts">
import { reactive } from "vue";
import type { IFrameOptions } from "@/types";
import FrameItem from "./FrameItem.vue";
import FrameControls from "./FrameControls.vue";

interface IState {
  selectedFrame: number;
}
const props = defineProps<{
  frames: IFrameOptions[];
}>();

const emit = defineEmits<{
  (e: "updateFrameList", frameList: IFrameOptions[], index: number): void;
  (e: "selectFrame", frameIndex: number): void;
}>();

const state: IState = reactive({
  selectedFrame: -1,
});

function selectFrame(index: number) {
  state.selectedFrame = index;
  emit("selectFrame", index);
}

function updateFrame(updatedFrame: IFrameOptions, update = true) {
  if (state.selectedFrame > -1) {
    const updatedList = [...props.frames];
    updatedList[state.selectedFrame] = updatedFrame;
    emit("updateFrameList", updatedList, update ? state.selectedFrame : -1);
  }
}

function saveFrame(updatedFrame: IFrameOptions) {
  updateFrame(updatedFrame, false);
  state.selectedFrame = -1;
}

function deleteFrame(index: number) {
  const updatedList = [...props.frames];
  updatedList.splice(index, 1);
  emit("updateFrameList", updatedList, -1);
}
</script>

<template>
  <div class="frame-list">
    Frame list:
    <div v-for="(frame, index) in frames" class="frame-items">
      <FrameItem
        :frame="frame"
        @select-frame="selectFrame(index)"
        @delete-frame="deleteFrame(index)"
      />
      <FrameControls
        v-if="state.selectedFrame === index"
        :frame="frame"
        @update="updateFrame"
        @save="saveFrame"
      />
    </div>
  </div>
</template>

<style scoped>
  .frame-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .frame-list .frame-items {
    width: 100%;
  }
</style>
