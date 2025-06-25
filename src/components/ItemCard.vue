<script setup lang="ts">
import type { Item } from '@/types/item'

interface Props {
  item: Item
  isSelected?: boolean
  isDisabled?: boolean
  showRemoveButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  isDisabled: false,
  showRemoveButton: false,
})

const emit = defineEmits<{
  click: [item: Item]
  remove: [item: Item]
}>()

const handleClick = (): void => {
  if (!props.isDisabled) {
    emit('click', props.item)
  }
}

const handleRemove = (): void => {
  emit('remove', props.item)
}
</script>

<template>
  <div
    class="item-card"
    :class="{
      selected: isSelected,
      disabled: isDisabled,
    }"
    @click="handleClick"
  >
    {{ item.name }}
    <button v-if="showRemoveButton" @click.stop="handleRemove" class="item-card__remove-btn">
      ✕
    </button>
  </div>
</template>

<style scoped lang="scss">
.item-card {
  background-color: white;
  border: 2px solid #ddd;
  border-radius: 6px;
  padding: 12px 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover {
    border-color: #bbb;
    background-color: #f9f9f9;
  }

  &.selected {
    background-color: #e3f2fd;
    border-color: #2196f3;
    color: #1976d2;
    font-weight: bold;
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f0f0f0;
  }

  &.disabled:hover {
    border-color: #ddd;
    background-color: #f0f0f0;
  }

  &:has(.item-card__remove-btn) {
    background-color: #e8f5e8;
    border-color: #4caf50;
    color: #2e7d32;
    font-weight: bold;
  }

  &__remove-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    background: #ff4444;
    color: white;
    border: none;
    border-radius: 3px;
    width: 12px;
    height: 12px;
    cursor: pointer;
    font-size: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #cc0000;
    }
  }
}
</style>
