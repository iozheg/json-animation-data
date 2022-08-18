<script setup lang="ts">
import type { IListItem } from "@/types";

defineProps<{
  item: IListItem;
  editable: boolean;
  selected: boolean;
}>();

const emit = defineEmits<{
  (e: "select"): void;
  (e: "edit"): void;
  (e: "delete"): void;
}>();
</script>

<template>
  <div class="list-item" :class="{ selected: selected }">
    <div class="list-item__name" @click="emit('select')">
      {{ item.name }}
    </div>
    <button
      v-if="editable"
      class="btn list-item__change"
      @click="emit('edit')"
    >Edit</button>
    <button
      class="btn list-item__delete"
      @click="emit('delete')"
    >Del</button>
  </div>
</template>

<style scoped>
.list-item {
  display: flex;
  width: 100%;
  margin-bottom: 4px;
  padding-left: 4px;
}

.list-item:hover {
  background-color: var(--color-bkgnd-item-hover);
}

.list-item:last-of-type {
  margin-bottom: 0px;
}

.list-item.selected {
  background-color: var(--color-bkgnd-item-selected);
}

.list-item .btn {
  width: unset;
}

.list-item .list-item__name {
  flex-grow: 1;
  width: 150px;
}

.list-item .list-item__name:hover {
  color: white;
  cursor: pointer;
}

.list-item .list-item__change {
  margin-right: 6px;
}
</style>
