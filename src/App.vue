<script setup lang="ts">
import { computed, reactive } from "vue";
import Controls from "./components/Controls.vue"
import WorkZone from "./components/WorkZone.vue"
import FrameCanvas from "./components/FrameCanvas.vue";
import ListTabs from "./components/ListTabs.vue";
import List from "./components/List.vue";
import EditFrameForm from "./components/EditFrameForm.vue";
import type { IFramesForm, IFrameOptions, IAnimation, IListTabs } from "./types";
import { ControlView, ListType } from "./enums";

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
  listTabs: IListTabs[];
  selectedListTab: ListType;
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
  listTabs: [
    { type: ListType.FRAMES, label: "Frames" },
    { type: ListType.ANIMATIONS, label: "Animations" },
  ],
  selectedListTab: ListType.FRAMES,
});

const size = computed(() => {
  return {
    width: (state.image?.width || 0) * state.scale,
    height: (state.image?.height || 0) * state.scale,
  }
});

const showListBlock = computed(() => {
  return state.controlView === ControlView.NONE
    && (state.frames.length || state.animations.length);
});

function reset() {
  state.editableFrameIndex = -1;
  state.editableFrame = null;
}

function showControlView(view: ControlView) {
  reset();
  state.controlView = view;
}

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
  reset();
}

function cancelFrameEditing() {
  reset();
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
      @image-loaded="state.image = $event"
      @update-scale="updateScale"
      @show-control-view="showControlView"
      @update-frames-form="updateData"
      @add-frames="addFrames"
      @select-frames="selectFrames"
      @add-animation="addAnimation"
    />

    <template v-if="showListBlock">
      <ListTabs
        :tabs="state.listTabs"
        :selected="state.selectedListTab"
        class="list-tabs"
        @selectTab="state.selectedListTab = $event"
      />
      <List
        v-if="state.selectedListTab === ListType.FRAMES"
          :items="state.frames"
          :editable="true"
          @update-list="updateFrames"
          @select-item="selectFrame"
          @edit-item="editFrame"
      />
      <List
        v-if="state.selectedListTab === ListType.ANIMATIONS"
          :items="state.animations"
          @update-list="updateAnimations"
          @select-item="selectAnimation"
      />
    </template>

    <EditFrameForm
      v-if="state.editableFrame"
      :frame="state.editableFrame"
      @update="updateFrame"
      @save="saveFrame"
      @cancel="cancelFrameEditing"
    />
  </div>
  <div v-if="state.image" class="image-wrapper">
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
  padding: 30px 10px 0 10px;
}

.image-wrapper {
  padding-top: 30px;
}

.list-tabs {
  margin-top: 30px;
}
</style>
