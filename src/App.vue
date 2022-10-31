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
  visibleFrames: IFrameOptions[];
  selectedFrameNames: string[];
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
  visibleFrames: [],
  selectedFrameNames: [],
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
  state.selectedFrameNames = [];
  state.errorMsg = "";

  switch (state.controlView) {
    case ControlView.NONE:
      state.visibleFrames = [...state.frames];
      break;
    case ControlView.CREATE_FRAMES:
      state.visibleFrames = [];
      break;
    case ControlView.CREATE_ANIMATION:
      state.visibleFrames = [];
      break;
  }
}

function changeControlView(view: ControlView) {
  state.controlView = view;
  reset();
}

function updateData(form: IFramesForm) {
  state.framesForm = form; //??? remove?? not used
  if (state.image) {
    state.visibleFrames = buildFrames(form, state.image.width);
  }
}

function setImage(image: HTMLImageElement, name: string) {
  state.image = image,
  state.fileName = name;
}

function updateScale(scale: number) {
  state.scale = scale;
}

function exportData() {
  createJson(state.frames, state.animations, state.fileName);
}

function addFrames() {
  const newFrameNames = state.visibleFrames.map(({ name }) => name);
  const dublicate = state.frames.find(({ name }) => newFrameNames.includes(name));
  if (dublicate) {
    state.errorMsg = strings.frameNameError;
  } else {
    state.frames.push(...state.visibleFrames);
    state.visibleFrames = [...state.frames];
    changeControlView(ControlView.NONE);
  }
}

function deleteFrame(name: string) {
  const frameIndex = state.frames.findIndex(frame => frame.name === name);
  state.frames.splice(frameIndex, 1);
  reset();
}

function selectFrame(name: string) {
  state.selectedFrameNames = [name];
}

function editFrame(index: number) {
  state.editableFrameIndex = index;
  state.editableFrame = state.frames[index];
  selectFrame(state.frames[index].name);
}

function updateFrame(updatedFrame: IFrameOptions) {
  state.editableFrame = updatedFrame;
  state.visibleFrames = [updatedFrame];
}

function saveFrame(updatedFrame: IFrameOptions) {
  state.frames[state.editableFrameIndex] = updatedFrame;
  reset();
}

function cancelFrameEditing() {
  reset();
}


function addAnimation(name: string, frameNames: string[]) {
  if (state.animations.find((animation) => animation.name === name)) {
    state.errorMsg = strings.animationNameError;
  } else {
    state.animations.push({ name, frameNames });
    changeControlView(ControlView.NONE);
  }
}

function deleteAnimation(name: string) {
  const animationIndex = state.animations.findIndex(anim => anim.name === name);
  state.animations.splice(animationIndex, 1);
  reset();
}

function selectAnimation(name: string) {
  const animation = state.animations.find(anim => anim.name === name);
  showFrames(animation?.frameNames || []);
}

function showFrames(names: string[]) {
  state.visibleFrames = state.frames.filter(frame => names.includes(frame.name));
}

function showListTab(listType: ListType) {
  state.selectedListTab = listType;
  reset();
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
      @show-control-view="changeControlView"
      @update-frames-form="updateData"
      @add-frames="addFrames"
      @select-frames="showFrames"
      @add-animation="addAnimation"
    />

    <template v-if="showListBlock">
      <ListTabs
        :tabs="state.listTabs"
        :selected="state.selectedListTab"
        class="list-tabs"
        @selectTab="showListTab"
      />
      <List
        v-if="state.selectedListTab === ListType.FRAMES"
          :items="state.frames"
          :editable="true"
          @delete-item="deleteFrame"
          @select-item="selectFrame"
          @edit-item="editFrame"
      />
      <List
        v-if="state.selectedListTab === ListType.ANIMATIONS"
          :items="state.animations"
          @delete-item="deleteAnimation"
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
      :frames="state.visibleFrames"
      :selectedFrames="state.selectedFrameNames"
      :scale="state.scale"
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
