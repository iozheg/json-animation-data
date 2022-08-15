<script setup lang="ts">
import type { IFrameOptions } from "@/types";

defineProps<{
  frame: IFrameOptions;
}>();

const emit = defineEmits<{
  (e: "selectFrame"): void;
  (e: "deleteFrame"): void;
}>();
</script>

<template>
  <div class="frame-item">
    <div class="frame-item__name" @click="emit('selectFrame')">
      {{ frame.name }}
    </div>
    <button class="frame-item__change" @click="emit('selectFrame')">Change</button>
    <button class="frame-item__delete" @click="emit('deleteFrame')">Del</button>
  </div>
</template>

<style scoped>
.frame-item {
  display: flex;
}

.frame-item .frame-item__name {
  width: 150px;
}

.frame-item .frame-item__name:hover {
  color: white;
  cursor: pointer;
}

.frame-item .frame-item__change {
  margin-right: 6px;
}
</style>
