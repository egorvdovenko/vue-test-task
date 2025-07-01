import { ref } from 'vue'
import type { Item } from '@/types/item'

export function useItems(
  initialItems: Item[],
  options: {
    allowMultiple?: boolean
    maxSelection?: number
  } = {},
) {
  const { allowMultiple = true, maxSelection = Infinity } = options

  const items = ref<Item[]>(initialItems)
  const selectedItems = ref<Item[]>([])

  function isItemSelected(item: Item): boolean {
    return selectedItems.value.some((selected) => selected.id === item.id)
  }

  function isItemDisabled(item: Item): boolean {
    return allowMultiple
      ? selectedItems.value.length >= maxSelection && !isItemSelected(item)
      : selectedItems.value.length > 0 && !isItemSelected(item)
  }

  function toggleItem(item: Item) {
    const index = selectedItems.value.findIndex((selected) => selected.id === item.id)

    if (index > -1) {
      selectedItems.value.splice(index, 1)
    } else {
      if (allowMultiple) {
        if (selectedItems.value.length < maxSelection) {
          selectedItems.value.push(item)
        }
      } else {
        selectedItems.value = [item]
      }
    }
  }

  function removeItem(item: Item) {
    const index = selectedItems.value.findIndex((selected) => selected.id === item.id)

    if (index > -1) {
      if (allowMultiple) {
        selectedItems.value.splice(index, 1)
      } else {
        selectedItems.value = []
      }
    }
  }

  return {
    items,
    selectedItems,
    isItemSelected,
    isItemDisabled,
    toggleItem,
    removeItem,
  }
}
