<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import SelectedItemsSection from '@/components/SelectedItemsSection.vue'
import ItemsSection from '@/components/ItemsSection.vue'
import { useItemsStore } from '@/stores/items'
import { useItems } from '@/composables/useItems'

const itemsStore = useItemsStore()
const { userItems, choiceItems } = storeToRefs(itemsStore)

const {
  selectedItems: userSelectedItems,
  isItemSelected: isUserItemSelected,
  isItemDisabled: isUserItemDisabled,
  toggleItem: toggleUserItem,
  removeItem: removeUserItem,
} = useItems(userItems.value, {
  allowMultiple: true,
  maxSelection: 6
})

const {
  selectedItems: selectedChoiceItems,
  isItemSelected: isChoiceItemSelected,
  isItemDisabled: isChoiceItemDisabled,
  toggleItem: toggleChoiceItem,
  removeItem: removeChoiceItem,
} = useItems(choiceItems.value, {
  allowMultiple: false,
  maxSelection: 1
})

const userItemsTitle = computed(() => 
  `Selected User Items (${userSelectedItems.value.length}/6)`
)
</script>

<template>
  <div class="app">
    <h1>Vue Test Task</h1>
    <div class="top-section">
      <SelectedItemsSection
        :title="userItemsTitle"
        :selected-items="userSelectedItems"
        placeholder-text="No user items selected"
        @item-remove="removeUserItem"
      />
      <SelectedItemsSection
        title="Selected Choice Item"
        :selected-items="selectedChoiceItems"
        placeholder-text="No choice item selected"
        @item-remove="removeChoiceItem"
      />
    </div>
    <div class="bottom-section">
      <ItemsSection
        title="User Items"
        :items="userItems"
        :is-item-selected="isUserItemSelected"
        :is-item-disabled="isUserItemDisabled"
        @item-click="toggleUserItem"
      />
      <ItemsSection
        title="Choice Items"
        :items="choiceItems"
        :is-item-selected="isChoiceItemSelected"
        :is-item-disabled="isChoiceItemDisabled"
        @item-click="toggleChoiceItem"
      />
    </div>
  </div>
</template>

<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
}

.top-section, 
.bottom-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

@media (max-width: 768px) {
  .top-section, 
  .bottom-section {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .app {
    padding: 15px;
  }
}
</style>
