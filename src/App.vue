<script setup lang="ts">
import { computed, reactive } from "vue";
import Controls from "./components/Controls.vue"
import WorkZone from "./components/WorkZone.vue"
import FrameCanvas from "./components/FrameCanvas.vue";
import List from "./components/List.vue";
import FrameControls from "./components/FrameControls.vue";
import type { IFramesForm, IFrameOptions, IAnimation } from "./types";
import { ControlView } from "./enums";

interface IState {
  image: HTMLImageElement | null;
  scale: number;
  controlView: ControlView;
  framesForm: IFramesForm | null;
  currentFrames: IFrameOptions[];
  frames: IFrameOptions[];
  animations: IAnimation[];
  editableFrameIndex: number;
  editableFrame: IFrameOptions | null;
}

const state = reactive<IState>({
  image: null,
  scale: 2,
  controlView: ControlView.NONE,
  framesForm: null,
  currentFrames: [],
  frames: [],
  animations: [],
  editableFrameIndex: -1,
  editableFrame: null,
});

const size = computed(() => {
  return {
    width: (state.image?.width || 0) * state.scale,
    height: (state.image?.height || 0) * state.scale,
  }
});

function updateData(form: IFramesForm) {
  state.framesForm = form;
  const frames: IFrameOptions[] = [];

  if (state.image) {
    const { amount, startOffset, spaceBetween, frameSize, frameName } = form;
    const framesInRow = Math.floor(state.image?.width / (frameSize.width + spaceBetween.x));
    const rows = Math.ceil(amount / framesInRow);
    for(let r = 0; r < rows; r++) {
      for(let i = 0; i < framesInRow && r * framesInRow + i < amount; i++) {
        const frame = {
          x: (i * (frameSize.width + spaceBetween.x) + startOffset.x + i) * state.scale,
          y: (r * (frameSize.height + spaceBetween.y) + startOffset.y + r) * state.scale,
          width: frameSize.width * state.scale,
          height: frameSize.height * state.scale,
          name: `${frameName}_${r * framesInRow + i}`,
        }
        frames.push(frame);
      }
    }

    state.currentFrames = frames;
  }
}

function updateScale(scale: number) {
  state.scale = scale;
  if (state.framesForm) {
    updateData(state.framesForm);
  }
}

function addFrames() {
  state.frames.push(...state.currentFrames);
  state.currentFrames = [];
}

function updateFrames(frameList: IFrameOptions[]) {
  state.frames = frameList;
  state.currentFrames = [];
}

function selectFrames(indexes: number[]) {
  state.currentFrames = indexes.map(index => state.frames[index]);
}

function selectFrame(index: number) {
  selectFrames([index]);
}

function editFrame(index: number) {
  state.editableFrameIndex = index;
  state.editableFrame = state.frames[index];
  state.currentFrames = [state.frames[index]];
}

function updateFrame(updatedFrame: IFrameOptions) {
  state.editableFrame = updatedFrame;
  state.currentFrames = [updatedFrame];
}

function saveFrame(updatedFrame: IFrameOptions) {
  state.frames[state.editableFrameIndex] = updatedFrame;
  state.editableFrameIndex = -1;
  state.editableFrame = null;
}

function cancelFrameEditing() {
  state.editableFrameIndex = -1;
  state.editableFrame = null;
}


function addAnimation(name: string, frameIndexes: number[]) {
  state.animations.push({ name, frameIndexes });
}

function updateAnimations(animations: IAnimation[]) {
  state.animations = animations;
  state.currentFrames = [];
}

function selectAnimation(index: number) {
  state.currentFrames = state.animations[index].frameIndexes.map(fIdx => state.frames[fIdx]);
}
</script>

<template>
  <div class="controls-wrapper">
    <Controls
      :scale="state.scale"
      :frames="state.frames"
      :controlView="state.controlView"
      @image-loaded="(img) => state.image = img"
      @update-scale="updateScale"
      @show-control-view="(view) => state.controlView = view"
      @update-frames-form="updateData"
      @add-frames="addFrames"
      @select-frames="selectFrames"
      @add-animation="addAnimation"
    />
    <List
      v-if="state.frames.length && state.controlView === ControlView.NONE"
        :title="'Frame list'"
        :items="state.frames"
        :editable="true"
        @update-list="updateFrames"
        @select-items="selectFrame"
        @edit-item="editFrame"
    />
    <List
      v-if="state.animations.length && state.controlView === ControlView.NONE"
        :title="'Animation list'"
        :items="state.animations"
        @update-list="updateAnimations"
        @select-items="selectAnimation"
    />
    <FrameControls
      v-if="state.editableFrame"
      :frame="state.editableFrame"
      @update="updateFrame"
      @save="saveFrame"
      @cancel="cancelFrameEditing"
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
