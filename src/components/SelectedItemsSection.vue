<script setup lang="ts">
import ItemCard from '@/components/ItemCard.vue'
import type { Item } from '@/types/item'

interface Props {
  title: string
  selectedItems: Item[]
  placeholderText?: string
}

withDefaults(defineProps<Props>(), {
  placeholderText: 'No items selected'
})

const emit = defineEmits<{
  'item-remove': [item: Item]
}>()

const handleItemRemove = (item: Item) => {
  emit('item-remove', item)
}
</script>

<template>
  <div class="selected-items-section">
    <h3>{{ title }}</h3>
    <div class="items-grid">
      <ItemCard
        v-for="item in selectedItems"
        :key="item.id"
        :item="item"
        :show-remove-button="true"
        @remove="handleItemRemove"
      />
      <div v-if="selectedItems.length === 0" class="placeholder">
        {{ placeholderText }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.selected-items-section {
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

.placeholder {
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 12px 8px;
  border: 2px dashed #ddd;
  border-radius: 6px;
  background-color: #fafafa;
  font-size: 14px;
  grid-column: 1 / -1;
}

@media (max-width: 768px) {
  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>
