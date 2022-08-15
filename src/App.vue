<script setup lang="ts">
import { computed, reactive } from "vue";
import Controls from "./components/Controls.vue"
import WorkZone from "./components/WorkZone.vue"
import FrameCanvas from "./components/FrameCanvas.vue";
import FrameList from "./components/FrameList.vue";
import type { IFrameControls, IFrameOptions } from "./types";

interface IState {
  image: HTMLImageElement | null;
  scale: number;
  showCreateFrames: boolean;
  currentFrames: IFrameOptions[];
  frames: IFrameOptions[];
}

const state = reactive<IState>({
  image: null,
  scale: 2,
  showCreateFrames: false,
  currentFrames: [],
  frames: [],
});

const size = computed(() => {
  return {
    width: state.image?.width * state.scale,
    height: state.image?.height * state.scale,
  }
});

function dataUpdate(controls: IFrameControls) {
  const frames: IFrameOptions[] = [];

  if (state.image) {
    const { amount, startOffset, spaceBetween, frameSize, frameName } = controls;
    const framesInRow = Math.floor(state.image?.width / (frameSize.width + spaceBetween.x));
    const rows = Math.ceil(amount / framesInRow);
    for(let r = 0; r < rows; r++) {
      for(let i = 0; i < framesInRow && r * framesInRow + i < amount; i++) {
        const frame = {
          x: (i * (frameSize.width + spaceBetween.x) + startOffset.x + i) * state.scale,
          y: (r * (frameSize.height + spaceBetween.y) + startOffset.y + r) * state.scale,
          width: frameSize.width * state.scale,
          height: frameSize.height * state.scale,
          name: `frameName_${r * framesInRow + i}`,
        }
        frames.push(frame);
      }
    }

    state.currentFrames = frames;
  }
}

function updateScale(scale: number, controls: IFrameControls) {
  state.scale = scale;
  dataUpdate(controls);
}

function addFrames() {
  state.frames.push(...state.currentFrames);
  state.currentFrames = [];
  state.showCreateFrames = false;
}

function updateFrames(frameList: IFrameOptions[], index: number) {
  state.frames = frameList;
  selectFrame(index);
}

function selectFrame(index: number) {
  state.currentFrames = index > -1 ? [state.frames[index]] : [];
}
</script>

<template>
  <div class="controls-wrapper">
    <Controls
      :scale="state.scale"
      @image-loaded="(img) => state.image = img"
      @update-scale="updateScale"
      @show-create-frames="(status) => state.showCreateFrames = status"
      @data-updated="dataUpdate"
      @add-frames="addFrames"
    />
    <FrameList
      v-if="state.frames.length && !state.showCreateFrames"
      :frames="state.frames"
      @update-frame-list="updateFrames"
      @select-frame="selectFrame"
    />
  </div>
  <div v-if="state.image">
    <WorkZone
      :image-src="state.image.src"
      :img-width="size.width"
      :img-height="size.height"
    />
    <FrameCanvas
      :img-width="size.width"
      :img-height="size.height"
      :frames="state.currentFrames"
    />
  </div>
</template>

<style scoped>
.controls-wrapper {
  max-width: 300px;
  width: 300px;
  margin-right: 6px;
}
</style>
