<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useItemsStore } from '@/stores/items'
import { useItems } from '@/composables/useItems'
import ItemCard from '@/components/ItemCard.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { t } = useI18n()

const itemsStore = useItemsStore()
const { userItems, isLoadingUserItems, choiceItems, isLoadingChoiceItems } = storeToRefs(itemsStore)

onMounted(() => {
  itemsStore.getUserItems()
  itemsStore.getChoiceItems()
})

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
    <h1>{{ t('LABELS.TITLE') }}</h1>
    <LanguageSwitcher />
    <div class="section">
      <div class="items-section">
        <h3>{{ t('LABELS.SELECTED_USER_ITEMS', { count: userSelectedItems.length }) }}</h3>
        <div class="items-section__grid">
          <ItemCard
            v-for="item in userSelectedItems"
            :key="item.id"
            :item="item"
            :show-remove-button="true"
            @remove="removeUserItem"
          />
          <div v-if="userSelectedItems.length === 0" class="items-section__placeholder">
            {{ t('LABELS.NO_USER_ITEMS_SELECTED') }}
          </div>
        </div>
      </div>
      <div class="items-section">
        <h3>{{ t('LABELS.SELECTED_CHOICE_ITEM', { count: selectedChoiceItems.length }) }}</h3>
        <div class="items-section__grid">
          <ItemCard
            v-for="item in selectedChoiceItems"
            :key="item.id"
            :item="item"
            :show-remove-button="true"
            @remove="removeChoiceItem"
          />
          <div v-if="selectedChoiceItems.length === 0" class="items-section__placeholder">
            {{ t('LABELS.NO_CHOICE_ITEM_SELECTED') }}
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="items-section">
        <h3>{{ t('LABELS.USER_ITEMS') }}</h3>
        <div v-if="isLoadingUserItems">{{ t('LABELS.USER_ITEMS_LOADING') }}</div>
        <div v-else class="items-section__grid">
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
        <h3>{{ t('LABELS.CHOICE_ITEMS') }}</h3>
        <div v-if="isLoadingChoiceItems">{{ t('LABELS.CHOICE_ITEMS_LOADING') }}</div>
        <div v-else class="items-section__grid">
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

.section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .app {
    padding: 15px;
  }

  .section {
    grid-template-columns: 1fr;
    gap: 15px;
    margin-bottom: 15px;
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
