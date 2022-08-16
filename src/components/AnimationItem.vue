<script setup lang="ts">
import type { IAnimation } from "@/types";

defineProps<{
  animation: IAnimation;
}>();

const emit = defineEmits<{
  (e: "selectAnimation"): void;
  (e: "deleteAnimation"): void;
}>();
</script>

<template>
  <div class="animation-item">
    <div class="animation-item__name" @click="emit('selectAnimation')">
      {{ animation.name }}
    </div>
    <button class="animation-item__delete" @click="emit('deleteAnimation')">Del</button>
  </div>
</template>

<style scoped>
.animation-item {
  display: flex;
  width: 100%;
}

.animation-item .animation-item__name {
  flex-grow: 1;
  width: 150px;
}

.animation-item .animation-item__name:hover {
  color: white;
  cursor: pointer;
}

.animation-item .animation-item__change {
  margin-right: 6px;
}
</style>
