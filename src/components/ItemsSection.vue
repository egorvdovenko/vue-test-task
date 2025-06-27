<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Item } from '@/types/item'

const { t } = useI18n()

interface Props {
  title: string
  placeholder?: string
  isLoading?: boolean
  items: Item[]
}

withDefaults(defineProps<Props>(), {
  isLoading: false,
})
</script>

<template>
  <div class="items-section">
    <h3>{{ title }}</h3>
    <div v-if="isLoading" class="items-section__loading">
      {{ t('LABELS.ITEMS_LOADING') }}
    </div>
    <div v-else class="items-section__grid">
      <slot :items="items"></slot>
      <div v-if="items.length === 0 && placeholder" class="items-section__placeholder">
        {{ placeholder }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
