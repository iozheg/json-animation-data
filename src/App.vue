<script setup lang="ts">
import { computed, reactive } from "vue";
import GeneralControls from "./components/GeneralControls.vue"
import DataControls from "./components/DataControls.vue"
import WorkZone from "./components/WorkZone.vue"
import FrameCanvas from "./components/FrameCanvas.vue";
import ListTabs from "./components/ListTabs.vue";
import List from "./components/List.vue";
import EditFrameForm from "./components/EditFrameForm.vue";
import Information from "./components/Information.vue";
import type { IFramesForm, IFrameOptions, IAnimation, IListTabs } from "./types";
import { ControlView, ListType } from "./enums";
import { buildFrames, createJson } from "./logic";
import strings from "./strings";

interface IState {
  image: HTMLImageElement | null;
  fileName: string,
  scale: number;
  controlView: ControlView;
  framesForm: IFramesForm | null;
  errorMsg: string,
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
  fileName: "",
  scale: 2,
  controlView: ControlView.NONE,
  framesForm: null,
  errorMsg: "",
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
  if (state.image) {
    state.currentFrames = buildFrames(form, state.scale, state.image.width);
  }
}

function setImage(image: HTMLImageElement, name: string) {
  state.image = image,
  state.fileName = name;
}

function updateScale(scale: number) {
  state.scale = scale;
  if (state.framesForm) {
    updateData(state.framesForm);
  }
}

function exportData() {
  createJson(state.frames, state.animations, state.scale, state.fileName);
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
  if (state.animations.find((animation) => animation.name === name)) {
    state.errorMsg = strings.animationNameError;
  } else {
    state.animations.push({ name, frameIndexes });
  }
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
    <GeneralControls
      :scale="state.scale"
      :readyToExport="!!state.frames.length"
      @image-loaded="setImage"
      @update-scale="updateScale"
      @export-json="exportData"
    />
    <DataControls
      v-if="state.image"
      :frames="state.frames"
      :controlView="state.controlView"
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
    <Information
      v-if="state.errorMsg"
      :text="state.errorMsg"
      :type="'error'"
      class="errorMsg"
      @clear-msg="state.errorMsg = ''"
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

.errorMsg {
  margin-top: 20px;
}

.image-wrapper {
  padding-top: 30px;
}

.list-tabs {
  margin-top: 30px;
}
</style>
