<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useItemsStore } from '@/stores/items'
import { useItems } from '@/composables/useItems'
import ItemCard from '@/components/ItemCard.vue'

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
  maxSelection: 6,
})

const {
  selectedItems: selectedChoiceItems,
  isItemSelected: isChoiceItemSelected,
  isItemDisabled: isChoiceItemDisabled,
  toggleItem: toggleChoiceItem,
  removeItem: removeChoiceItem,
} = useItems(choiceItems.value, {
  allowMultiple: false,
  maxSelection: 1,
})
</script>

<template>
  <div class="app">
    <h1>Vue Test Task</h1>
    <div class="top-section">
      <div class="items-section">
        <h3>Selected User Items ({{ userSelectedItems.length }}/6)</h3>
        <div class="items-section__grid">
          <ItemCard
            v-for="item in userSelectedItems"
            :key="item.id"
            :item="item"
            :show-remove-button="true"
            @remove="removeUserItem"
          />
          <div v-if="userSelectedItems.length === 0" class="items-section__placeholder">
            No user items selected
          </div>
        </div>
      </div>
      <div class="items-section">
        <h3>Selected Choice Item ({{ selectedChoiceItems.length }}/1)</h3>
        <div class="items-section__grid">
          <ItemCard
            v-for="item in selectedChoiceItems"
            :key="item.id"
            :item="item"
            :show-remove-button="true"
            @remove="removeChoiceItem"
          />
          <div v-if="selectedChoiceItems.length === 0" class="items-section__placeholder">
            No choice item selected
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-section">
      <div class="items-section">
        <h3>User Items</h3>
        <div class="items-section__grid">
          <ItemCard
            v-for="item in userItems"
            :key="item.id"
            :item="item"
            :is-selected="isUserItemSelected(item)"
            :is-disabled="isUserItemDisabled(item)"
            @click="toggleUserItem(item)"
          />
        </div>
      </div>
      <div class="items-section">
        <h3>Choice Items</h3>
        <div class="items-section__grid">
          <ItemCard
            v-for="item in choiceItems"
            :key="item.id"
            :item="item"
            :is-selected="isChoiceItemSelected(item)"
            :is-disabled="isChoiceItemDisabled(item)"
            @click="toggleChoiceItem(item)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
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

.items-section {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background-color: #f9f9f9;
  min-height: 200px;

  h3 {
    margin-bottom: 15px;
    color: #555;
    font-size: 16px;
  }

  &__placeholder {
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

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
  }

  @media (max-width: 768px) {
    &__grid {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }
  }
}
</style>
