<script setup lang="ts">
  defineProps<{
    text: string;
    type?: string;
  }>();
</script>

<template>
  <div class="information" v-html="text"></div>
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
</style>