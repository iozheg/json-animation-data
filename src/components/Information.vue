<script setup lang="ts">
  import { computed } from "vue";

  const props = defineProps<{
    text: string;
    type?: string;
  }>();

  defineEmits<{
    (e: "clearMsg"): void
  }>();

  const isError = computed(() => props.type === "error");
</script>

<template>
  <div class="information" :class="{ error: isError }">
    <div class="msg" v-html="text"></div>
    <button
      v-if="isError"
      class="btn clear-button"
      @click="$emit('clearMsg')"
    >&times;</button>
  </div>
</template>

<style scoped>
  .information {
    width: 100%;
    padding-left: 4px;
    border-top: 1px solid var(--color-accent);
    background-color: var(--color-bkgnd-component);
    font-size: 12px;
  }

  .information :deep(*) {
    font-size: 12px;
  }

  .information.error {
    background-color: #ee4b4b;
  }

  .information .clear-button {
    position: absolute;
    top: 0;
    right: 0;
    width: 18px;
    height: 18px;
    padding: 0;
    background-color: unset;
    font-size: 16px;
  }
</style>