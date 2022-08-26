<script setup lang="ts">
import type { IFrameOptions } from "@/types";
import { onMounted, ref, watch } from "vue";

const props = defineProps<{
  imgWidth: number;
  imgHeight: number;
  frames: IFrameOptions[];
  scale: number;
}>();

const canvas = ref<HTMLCanvasElement>(null);
let context: CanvasRenderingContext2D | null;

onMounted(() => {
  context = canvas.value.getContext("2d");
});

watch(() => props.frames, () => drawFrames());
watch(() => props.scale, () => drawFrames());

function drawFrames() {
  if (context) {
    context.clearRect(0, 0, props.imgWidth, props.imgHeight);
    context.lineWidth = 1;
    context.strokeStyle = "rgba(255, 0, 0, 0.7)";
    props.frames.forEach(({ x, y, width, height }) => {
      context?.strokeRect(
        x * props.scale,
        y * props.scale,
        width * props.scale,
        height * props.scale,
      );
    });
  }
}
</script>

<template>
 <canvas ref="canvas" :width="imgWidth" :height="imgHeight"></canvas>
</template>

<style scoped>
  canvas {
    position: absolute;
    top: 30px;
  }
</style>