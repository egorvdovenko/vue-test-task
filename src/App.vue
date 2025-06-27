<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useItemsStore } from '@/stores/items'
import { useItems } from '@/composables/useItems'
import ItemCard from '@/components/ItemCard.vue'
import ItemsSection from '@/components/ItemsSection.vue'
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
      <ItemsSection
        :title="t('LABELS.SELECTED_USER_ITEMS', { count: userSelectedItems.length })"
        :placeholder="t('LABELS.NO_USER_ITEMS_SELECTED')"
        :items="userSelectedItems"
      >
        <ItemCard
          v-for="item in userSelectedItems"
          :key="item.id"
          :item="item"
          :show-remove-button="true"
          @remove="removeUserItem"
        />
      </ItemsSection>
      <ItemsSection
        :title="t('LABELS.SELECTED_CHOICE_ITEM', { count: selectedChoiceItems.length })"
        :placeholder="t('LABELS.NO_CHOICE_ITEM_SELECTED')"
        :items="selectedChoiceItems"
      >
        <ItemCard
          v-for="item in selectedChoiceItems"
          :key="item.id"
          :item="item"
          :show-remove-button="true"
          @remove="removeChoiceItem"
        />
      </ItemsSection>
    </div>
    <div class="section">
      <ItemsSection
        :items="userItems"
        :title="t('LABELS.USER_ITEMS')"
        :is-loading="isLoadingUserItems"
      >
        <ItemCard
          v-for="item in userItems"
          :key="item.id"
          :item="item"
          :is-selected="isUserItemSelected(item)"
          :is-disabled="isUserItemDisabled(item)"
          @click="toggleUserItem(item)"
        />
      </ItemsSection>
      <ItemsSection
        :items="choiceItems"
        :title="t('LABELS.CHOICE_ITEMS')"
        :is-loading="isLoadingChoiceItems"
      >
        <ItemCard
          v-for="item in choiceItems"
          :key="item.id"
          :item="item"
          :is-selected="isChoiceItemSelected(item)"
          :is-disabled="isChoiceItemDisabled(item)"
          @click="toggleChoiceItem(item)"
        />
      </ItemsSection>
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
</style>
