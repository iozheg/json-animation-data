<script setup lang="ts">
import { reactive } from "vue";
import type { IAnimation, IFrameOptions } from "@/types";
import AnimationItem from "./AnimationItem.vue";

interface IState {
  selectedAnimation: number;
}
const props = defineProps<{
  animations: IAnimation[];
  frames: IFrameOptions[]
}>();

const emit = defineEmits<{
  (e: "updateAnimationList", animationList: IAnimation[], index: number): void;
  (e: "selectAnimation", frameIndexes: number[]): void;
}>();

const state: IState = reactive({
  selectedAnimation: -1,
});

function selectAnimation(index: number) {
  state.selectedAnimation = index;
  emit("selectAnimation", props.animations[index].frameIndexes);
}

// function updateFrame(updatedFrame: IFrameOptions, update = true) {
//   if (state.selectedFrame > -1) {
//     const updatedList = [...props.frames];
//     updatedList[state.selectedFrame] = updatedFrame;
//     emit("updateAnimationList", updatedList, update ? state.selectedFrame : -1);
//   }
// }

// function saveFrame(updatedFrame: IFrameOptions) {
//   updateFrame(updatedFrame, false);
//   state.selectedFrame = -1;
// }

function deleteAnimation(index: number) {
  const updatedList = [...props.animations];
  updatedList.splice(index, 1);
  emit("updateAnimationList", updatedList, -1);
}
</script>

<template>
  <div class="animation-list">
    Animation list:
    <div v-for="(animation, index) in animations" class="animation-items">
      <AnimationItem
        :animation="animation"
        @select-animation="selectAnimation(index)"
        @delete-animation="deleteAnimation(index)"
      />
      <!-- <FrameControls
        v-if="state.selectedFrame === index"
        :frame="frame"
        @update="updateFrame"
        @save="saveFrame"
      /> -->
    </div>
  </div>
</template>

<style scoped>
  .animation-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .animation-list .animation-items {
    width: 100%;
  }
</style>
