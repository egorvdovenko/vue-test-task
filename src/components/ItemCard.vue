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
  showRemoveButton: false
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
    class="item"
    :class="{ 
      'selected': isSelected,
      'disabled': isDisabled
    }"
    @click="handleClick"
  >
    {{ item.name }}
    <button 
      v-if="showRemoveButton" 
      @click.stop="handleRemove" 
      class="remove-btn"
    >
      ✕
    </button>
  </div>
</template>

<style scoped>
.item {
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
}

.item:hover {
  border-color: #999;
  background-color: #f5f5f5;
}

.item.selected {
  background-color: #e3f2fd;
  border-color: #2196F3;
  color: #1976D2;
  font-weight: bold;
}

.item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f0f0f0;
}

.item.disabled:hover {
  border-color: #ddd;
  background-color: #f0f0f0;
}

.item:has(.remove-btn) {
  background-color: #e8f5e8;
  border-color: #4CAF50;
  color: #2E7D32;
  font-weight: bold;
  padding-right: 30px;
}

.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 3px;
  width: 16px;
  height: 16px;
  cursor: pointer;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: #cc0000;
}
</style>
