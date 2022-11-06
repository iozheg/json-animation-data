<script setup lang="ts">
import type { IFrameOptions } from "@/types";
import { onMounted, reactive, ref, watch, nextTick } from "vue";

const props = withDefaults(defineProps<{
  imgWidth: number;
  imgHeight: number;
  frames: IFrameOptions[];
  selectedFrames: string[];
  scale: number;
  interactive?: boolean;
}>(), {
  interactive: true
});

const emit = defineEmits<{
  (e: "updateFrame", frames: IFrameOptions): void;
}>();

const state = reactive({
  scaledFrames: <IFrameOptions[]>[],
  hoveredFrame: <IFrameOptions | undefined> undefined,
  selectedFrameIndex: <number> -1,
  dragStartPosition: <{ x: number, y: number } | undefined> undefined,
});

const FRAME_COLOR = "rgba(255, 0, 0, 0.7)";
const FRAME_SELECTED_COLOR = "rgba(0, 255, 0, 0.7)";
const FRAME_HOVER_COLOR = "rgba(255, 200, 0, 0.7)";

const canvas = ref<HTMLCanvasElement>(null);
const gridCanvas = ref<HTMLCanvasElement>(null);
let context: CanvasRenderingContext2D;
let gridCanvasContext: CanvasRenderingContext2D;

onMounted(() => {
  context = canvas.value.getContext("2d") as CanvasRenderingContext2D;
  gridCanvasContext = gridCanvas.value.getContext("2d") as CanvasRenderingContext2D;
  drawGrid();
});

watch(() => props.frames, () => drawFrames());
watch(() => props.selectedFrames, () => drawFrames());
watch(() => props.scale, () => {
  nextTick(() => {
    drawFrames();
    drawGrid();
  });
});

function drawFrames() {
  if (context) {
    context.clearRect(0, 0, props.imgWidth, props.imgHeight);
    context.lineWidth = 1;
    state.scaledFrames = props.frames.map(({ x, y, width, height, name, selected }) => ({
        name,
        x: x * props.scale,
        y: y * props.scale,
        width: width * props.scale,
        height: height * props.scale,
        selected
    }));

    drawScaledFrames();

    state.hoveredFrame = undefined;
  }
}

function drawScaledFrames() {
  state.scaledFrames.forEach(({ name, x, y, width, height }) => {
    const strokeStyle = props.selectedFrames.includes(name) ? FRAME_SELECTED_COLOR : FRAME_COLOR;
    context.strokeStyle = name === state.hoveredFrame?.name ? FRAME_HOVER_COLOR : strokeStyle;
    context.strokeRect(x, y, width, height);
  });
}

function drawGrid(step = 1) {
  gridCanvasContext.clearRect(0, 0, props.imgWidth, props.imgHeight);
  gridCanvasContext.strokeStyle = "rgba(0, 0, 0, 0.3)";

  for (let i = 0; i < props.imgWidth; i += step * props.scale) {
    gridCanvasContext.beginPath();
    gridCanvasContext.moveTo(i, 0);
    gridCanvasContext.lineTo(i, props.imgHeight);
    gridCanvasContext.stroke();
  }

  for (let i = 0; i < props.imgHeight; i += step * props.scale) {
    gridCanvasContext.beginPath();
    gridCanvasContext.moveTo(0, i);
    gridCanvasContext.lineTo(props.imgWidth, i);
    gridCanvasContext.stroke();
  }
}

function mouseMoveHandler(event: MouseEvent) {
  if (!props.interactive) {
    return;
  }

  const mx = event.offsetX;
  const my = event.offsetY;

  if (state.dragStartPosition) {
    dragHandler(mx, my);
  } else {
    state.selectedFrameIndex = state.scaledFrames.findIndex(({ x, y, width, height }) => {
      return (x <= mx && (x + width) >= mx) && (y <= my && (y + height) >= my);
    });
    const hoveredFrame = state.scaledFrames[state.selectedFrameIndex];

    if (hoveredFrame?.name !== state.hoveredFrame?.name) {
      if (state.hoveredFrame) {
        redrawFrame(state.hoveredFrame);
      }

      if (hoveredFrame) {
        redrawFrame(hoveredFrame, FRAME_HOVER_COLOR);
        document.body.style.cursor = "pointer";
      } else {
        document.body.style.cursor = "unset";
      }
    }

    state.hoveredFrame = hoveredFrame;
  }
}

function mouseDownHandler(event: MouseEvent) {
  if (state.hoveredFrame) {
    state.dragStartPosition = {
      x: event.offsetX,
      y: event.offsetY,
    }
  }
}

function dragHandler(x: number, y: number) {
  if (state.hoveredFrame) {
    const startPosition = {
      x: state.dragStartPosition?.x || 0,
      y:state.dragStartPosition?.y || 0,
    };

    const offset = {
      x: Math.trunc((x - startPosition.x) / props.scale),
      y: Math.trunc((y - startPosition.y) / props.scale),
    };

    if (offset.x || offset.y) {
      state.hoveredFrame.x += offset.x * props.scale;
      state.hoveredFrame.y += offset.y * props.scale;

      state.dragStartPosition = {
        x: offset.x ? x : startPosition.x,
        y: offset.y ? y : startPosition.y,
      };

      context.clearRect(0, 0, props.imgWidth, props.imgHeight);
      drawScaledFrames();
    }
  }
}

function mouseUpHandler() {
  state.dragStartPosition = undefined;
  if (state.selectedFrameIndex >= 0 && state.hoveredFrame) {
    const updatedFrame = {
        name: state.hoveredFrame.name,
        x: state.hoveredFrame.x / props.scale,
        y: state.hoveredFrame.y / props.scale,
        width: state.hoveredFrame.width / props.scale,
        height: state.hoveredFrame.height / props.scale,
        selected: true
    };

    emit("updateFrame", updatedFrame);
  }
}

function mouseLeaveHandler() {
  if (state.hoveredFrame) {
    redrawFrame(state.hoveredFrame, FRAME_COLOR);
  }
  state.dragStartPosition = undefined;
  state.hoveredFrame = undefined;
  document.body.style.cursor = "unset";
}

function redrawFrame(frame: IFrameOptions, color?: string) {
  context.clearRect(frame.x, frame.y, frame.width, frame.height);

  if (!color) {
    context.strokeStyle = props.selectedFrames.includes(frame.name)
      ? FRAME_SELECTED_COLOR : FRAME_COLOR;
  } else {
    context.strokeStyle = color;
  }
  context.strokeRect(frame.x, frame.y, frame.width, frame.height);
}
</script>

<template>
  <canvas
    ref="gridCanvas"
    :width="imgWidth"
    :height="imgHeight"
  ></canvas>
  <canvas
    ref="canvas"
    :width="imgWidth"
    :height="imgHeight"
    @mousemove="mouseMoveHandler"
    @mousedown="mouseDownHandler"
    @mouseup="mouseUpHandler"
    @mouseleave="mouseLeaveHandler"
  ></canvas>
</template>

<style scoped>
  canvas {
    position: absolute;
    top: 30px;
  }
</style>