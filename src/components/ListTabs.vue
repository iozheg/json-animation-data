<script setup lang="ts">
import type { ListType } from "@/enums";
import type { IListTabs } from "@/types";

defineProps<{
  tabs: IListTabs[];
  selected: ListType;
}>();

defineEmits<{
  (e: "selectTab", type: ListType): void;
}>();
</script>

<template>
  <div class="list-buttons">
    <template v-for="tab in tabs">
      <button
        class="btn" 
        :class="{ selected: selected === tab.type }"
        @click="$emit('selectTab', tab.type)"
      >{{ tab.label }}</button>
    </template>
  </div>
</template>

<style scoped>
  .list-buttons .btn {
    margin: 0;
    border-radius: var(--border-radius) var(--border-radius) 0 0;
  }
  .list-buttons .btn.selected {
    background-color: darkgrey;
  }
</style>