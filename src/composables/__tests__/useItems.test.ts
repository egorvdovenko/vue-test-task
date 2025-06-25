import { describe, it, expect, beforeEach } from 'vitest'
import { useItems } from '../useItems'
import type { Item } from '@/types/item'

describe('useItems', () => {
  let mockItems: Item[]

  beforeEach(() => {
    mockItems = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ]
  })

  describe('initialization', () => {
    it('should initialize with provided items', () => {
      const { items } = useItems(mockItems)
      expect(items.value).toEqual(mockItems)
    })

    it('should initialize with empty selected items', () => {
      const { selectedItems } = useItems(mockItems)
      expect(selectedItems.value).toEqual([])
    })

    it('should use default options when not provided', () => {
      const { toggleItem, selectedItems } = useItems(mockItems)

      toggleItem(mockItems[0])
      toggleItem(mockItems[1])

      expect(selectedItems.value).toHaveLength(2)
    })
  })

  describe('isItemSelected', () => {
    it('should return false for unselected items', () => {
      const { isItemSelected } = useItems(mockItems)
      expect(isItemSelected(mockItems[0])).toBe(false)
    })

    it('should return true for selected items', () => {
      const { toggleItem, isItemSelected } = useItems(mockItems)
      toggleItem(mockItems[0])
      expect(isItemSelected(mockItems[0])).toBe(true)
    })

    it('should identify items by id', () => {
      const { toggleItem, isItemSelected } = useItems(mockItems)
      const itemCopy = { ...mockItems[0] }

      toggleItem(mockItems[0])
      expect(isItemSelected(itemCopy)).toBe(true)
    })
  })

  describe('isItemDisabled - multiple selection mode', () => {
    it('should not disable items when under max selection', () => {
      const { isItemDisabled, toggleItem } = useItems(mockItems, { maxSelection: 2 })

      toggleItem(mockItems[0])
      expect(isItemDisabled(mockItems[1])).toBe(false)
    })

    it('should disable unselected items when at max selection', () => {
      const { isItemDisabled, toggleItem } = useItems(mockItems, { maxSelection: 2 })

      toggleItem(mockItems[0])
      toggleItem(mockItems[1])

      expect(isItemDisabled(mockItems[2])).toBe(true)
    })

    it('should not disable already selected items when at max selection', () => {
      const { isItemDisabled, toggleItem } = useItems(mockItems, { maxSelection: 2 })

      toggleItem(mockItems[0])
      toggleItem(mockItems[1])

      expect(isItemDisabled(mockItems[0])).toBe(false)
      expect(isItemDisabled(mockItems[1])).toBe(false)
    })
  })

  describe('isItemDisabled - single selection mode', () => {
    it('should disable unselected items when one item is selected', () => {
      const { isItemDisabled, toggleItem } = useItems(mockItems, { allowMultiple: false })

      toggleItem(mockItems[0])

      expect(isItemDisabled(mockItems[1])).toBe(true)
      expect(isItemDisabled(mockItems[2])).toBe(true)
    })

    it('should not disable the selected item', () => {
      const { isItemDisabled, toggleItem } = useItems(mockItems, { allowMultiple: false })

      toggleItem(mockItems[0])

      expect(isItemDisabled(mockItems[0])).toBe(false)
    })

    it('should not disable any items when none are selected', () => {
      const { isItemDisabled } = useItems(mockItems, { allowMultiple: false })

      expect(isItemDisabled(mockItems[0])).toBe(false)
      expect(isItemDisabled(mockItems[1])).toBe(false)
      expect(isItemDisabled(mockItems[2])).toBe(false)
    })
  })

  describe('toggleItem - multiple selection mode', () => {
    it('should add item when not selected', () => {
      const { toggleItem, selectedItems } = useItems(mockItems)

      toggleItem(mockItems[0])

      expect(selectedItems.value).toEqual(expect.arrayContaining([mockItems[0]]))
      expect(selectedItems.value).toHaveLength(1)
    })

    it('should remove item when already selected', () => {
      const { toggleItem, selectedItems } = useItems(mockItems)

      toggleItem(mockItems[0])
      toggleItem(mockItems[0])

      expect(selectedItems.value).not.toEqual(expect.arrayContaining([mockItems[0]]))
      expect(selectedItems.value).toHaveLength(0)
    })

    it('should allow multiple items to be selected', () => {
      const { toggleItem, selectedItems } = useItems(mockItems)

      toggleItem(mockItems[0])
      toggleItem(mockItems[1])

      expect(selectedItems.value).toEqual(expect.arrayContaining([mockItems[0]]))
      expect(selectedItems.value).toEqual(expect.arrayContaining([mockItems[1]]))
      expect(selectedItems.value).toHaveLength(2)
    })

    it('should respect max selection limit', () => {
      const { toggleItem, selectedItems } = useItems(mockItems, { maxSelection: 2 })

      toggleItem(mockItems[0])
      toggleItem(mockItems[1])
      toggleItem(mockItems[2])

      expect(selectedItems.value).toHaveLength(2)
      expect(selectedItems.value).not.toEqual(expect.arrayContaining([mockItems[2]]))
    })
  })

  describe('toggleItem - single selection mode', () => {
    it('should replace selected item when selecting new item', () => {
      const { toggleItem, selectedItems } = useItems(mockItems, { allowMultiple: false })

      toggleItem(mockItems[0])
      toggleItem(mockItems[1])

      expect(selectedItems.value).toEqual(expect.arrayContaining([mockItems[1]]))
      expect(selectedItems.value).not.toEqual(expect.arrayContaining([mockItems[0]]))
      expect(selectedItems.value).toHaveLength(1)
    })

    it('should deselect item when toggling selected item', () => {
      const { toggleItem, selectedItems } = useItems(mockItems, { allowMultiple: false })

      toggleItem(mockItems[0])
      toggleItem(mockItems[0])

      expect(selectedItems.value).toHaveLength(0)
    })
  })

  describe('removeItem', () => {
    it('should remove selected item', () => {
      const { toggleItem, removeItem, selectedItems } = useItems(mockItems)

      toggleItem(mockItems[0])
      toggleItem(mockItems[1])
      removeItem(mockItems[0])

      expect(selectedItems.value).not.toEqual(expect.arrayContaining([mockItems[0]]))
      expect(selectedItems.value).toEqual(expect.arrayContaining([mockItems[1]]))
      expect(selectedItems.value).toHaveLength(1)
    })

    it('should do nothing when removing unselected item', () => {
      const { toggleItem, removeItem, selectedItems } = useItems(mockItems)

      toggleItem(mockItems[0])
      removeItem(mockItems[1])

      expect(selectedItems.value).toEqual(expect.arrayContaining([mockItems[0]]))
      expect(selectedItems.value).toHaveLength(1)
    })

    it('should identify items by id for removal', () => {
      const { toggleItem, removeItem, selectedItems } = useItems(mockItems)
      const itemCopy = { ...mockItems[0] }

      toggleItem(mockItems[0])
      removeItem(itemCopy)

      expect(selectedItems.value).toHaveLength(0)
    })
  })

  describe('edge cases', () => {
    it('should handle empty items array', () => {
      const { items, selectedItems } = useItems([])
      expect(items.value).toEqual([])
      expect(selectedItems.value).toEqual([])
    })

    it('should handle maxSelection of 0', () => {
      const { toggleItem, selectedItems, isItemDisabled } = useItems(mockItems, { maxSelection: 0 })

      expect(isItemDisabled(mockItems[0])).toBe(true)
      toggleItem(mockItems[0])
      expect(selectedItems.value).toHaveLength(0)
    })

    it('should handle maxSelection of 1 in multiple mode', () => {
      const { toggleItem, selectedItems, isItemDisabled } = useItems(mockItems, { maxSelection: 1 })

      toggleItem(mockItems[0])
      expect(selectedItems.value).toHaveLength(1)
      expect(isItemDisabled(mockItems[1])).toBe(true)
    })
  })
})
