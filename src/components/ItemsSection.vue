<script setup lang="ts">
import ItemCard from '@/components/ItemCard.vue'
import type { Item } from '@/types/item'

interface Props {
  title: string
  items: Item[]
  isItemSelected?: (item: Item) => boolean
  isItemDisabled?: (item: Item) => boolean
}

withDefaults(defineProps<Props>(), {
  isItemSelected: () => false,
  isItemDisabled: () => false,
})

const emit = defineEmits<{
  'item-click': [item: Item]
}>()

const handleItemClick = (item: Item) => {
  emit('item-click', item)
}
</script>

<template>
  <div class="items-section">
    <h3>{{ title }}</h3>
    <div class="items-grid">
      <ItemCard
        v-for="item in items"
        :key="item.id"
        :item="item"
        :is-selected="isItemSelected(item)"
        :is-disabled="isItemDisabled(item)"
        @click="handleItemClick"
      />
    </div>
  </div>
</template>

<style scoped>
.items-section {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background-color: #f9f9f9;
  min-height: 200px;
}

h3 {
  margin-bottom: 15px;
  color: #555;
  font-size: 16px;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

@media (max-width: 768px) {
  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>
