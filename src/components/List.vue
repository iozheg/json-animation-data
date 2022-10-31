<script setup lang="ts">
import { reactive } from "vue";
import type { IListItem } from "@/types";
import ListItem from "./ListItem.vue";

const props = defineProps<{
  items: IListItem[];
  editable?: boolean;
}>();

const emit = defineEmits<{
  (e: "deleteItem", name: string): void;
  (e: "selectItem", name: string): void;
  (e: "editItem", index: number): void;
}>();

const state = reactive({
  selectedItem: -1,
});

function selectItem(index: number) {
  state.selectedItem = index;
  emit("selectItem", props.items[index].name);
}

function editItem(index: number) {
  emit("editItem", index);
}

function deleteItem(index: number) {
  emit("deleteItem", props.items[index].name);
}
</script>

<template>
  <div class="list">
    <ListItem
      v-for="(item, index) in items"
      :item="item"
      :editable="!!editable"
      :selected="index === state.selectedItem"
      @select="selectItem(index)"
      @edit="editItem(index)"
      @delete="deleteItem(index)"
    />
  </div>
</template>

<style scoped>
  .list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: 175px;
    overflow: auto;
    background-color: var(--color-bkgnd-component);
    border-top: 1px solid var(--color-accent);
  }
</style>
