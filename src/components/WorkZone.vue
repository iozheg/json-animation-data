<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  imageSrc: string,
  imgWidth: number;
  imgHeight: number;
}>();

const wrapperStyle = computed(() => {
  return {
    width: props.imgWidth + "px",
    height: props.imgHeight + "px",
  }
});
</script>

<template>
  <div class="wrapper" :style="wrapperStyle">
    <img :src="imageSrc" :width="imgWidth" :height="imgHeight">
  </div>
</template>

<style scoped>
  .wrapper {
    background-color: white;
  }
</style>