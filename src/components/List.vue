<script setup lang="ts">
import { reactive } from "vue";
import type { IListItem } from "@/types";
import ListItem from "./ListItem.vue";

const props = defineProps<{
  items: IListItem[];
  editable?: boolean;
}>();

const emit = defineEmits<{
  (e: "updateList", list: IListItem[]): void;
  (e: "selectItems", index: number[]): void;
  (e: "editItem", index: number): void;
}>();

function selectItem(index: number) {
  emit("selectItems", [index]);
}

function editItem(index: number) {
  emit("editItem", index);
}

function deleteItem(index: number) {
  const updatedList = [...props.items];
  updatedList.splice(index, 1);
  emit("updateList", updatedList);
}
</script>

<template>
  <div class="list">
    <div v-for="(item, index) in items" class="list__items">
      <ListItem
        :item="item"
        :editable="editable"
        @select="selectItem(index)"
        @edit="editItem(index)"
        @delete="deleteItem(index)"
      />
    </div>
  </div>
</template>

<style scoped>
  .list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .list .list-items {
    width: 100%;
  }
</style>
