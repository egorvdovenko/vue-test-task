import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ItemsSection from '../ItemsSection.vue'
import ItemCard from '../ItemCard.vue'
import type { Item } from '@/types/item'

describe('ItemsSection', () => {
  const mockItems: Item[] = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ]

  describe('rendering', () => {
    it('should render title', () => {
      const wrapper = mount(ItemsSection, {
        props: {
          title: 'Test Section',
          items: mockItems,
        },
      })

      expect(wrapper.find('h3').text()).toBe('Test Section')
    })

    it('should render all items', () => {
      const wrapper = mount(ItemsSection, {
        props: {
          title: 'Test Section',
          items: mockItems,
        },
      })

      const itemCards = wrapper.findAllComponents(ItemCard)
      expect(itemCards).toHaveLength(mockItems.length)
    })

    it('should render empty section when no items provided', () => {
      const wrapper = mount(ItemsSection, {
        props: {
          title: 'Empty Section',
          items: [],
        },
      })

      const itemCards = wrapper.findAllComponents(ItemCard)
      expect(itemCards).toHaveLength(0)
    })
  })

  describe('item properties', () => {
    it('should pass correct item prop to each ItemCard', () => {
      const wrapper = mount(ItemsSection, {
        props: {
          title: 'Test Section',
          items: mockItems,
        },
      })

      const itemCards = wrapper.findAllComponents(ItemCard)
      itemCards.forEach((card, index) => {
        expect(card.props('item')).toEqual(mockItems[index])
      })
    })

    it('should use default isItemSelected function', () => {
      const wrapper = mount(ItemsSection, {
        props: {
          title: 'Test Section',
          items: mockItems,
        },
      })

      const itemCards = wrapper.findAllComponents(ItemCard)
      itemCards.forEach((card) => {
        expect(card.props('isSelected')).toBe(false)
      })
    })

    it('should use default isItemDisabled function', () => {
      const wrapper = mount(ItemsSection, {
        props: {
          title: 'Test Section',
          items: mockItems,
        },
      })

      const itemCards = wrapper.findAllComponents(ItemCard)
      itemCards.forEach((card) => {
        expect(card.props('isDisabled')).toBe(false)
      })
    })

    it('should use custom isItemSelected function', () => {
      const isItemSelected = vi.fn((item: Item) => item.id === 2)

      const wrapper = mount(ItemsSection, {
        props: {
          title: 'Test Section',
          items: mockItems,
          isItemSelected,
        },
      })

      const itemCards = wrapper.findAllComponents(ItemCard)
      expect(itemCards[0].props('isSelected')).toBe(false) // id: 1
      expect(itemCards[1].props('isSelected')).toBe(true) // id: 2
      expect(itemCards[2].props('isSelected')).toBe(false) // id: 3

      // Verify function was called for each item
      expect(isItemSelected).toHaveBeenCalledTimes(3)
      expect(isItemSelected).toHaveBeenCalledWith(mockItems[0])
      expect(isItemSelected).toHaveBeenCalledWith(mockItems[1])
      expect(isItemSelected).toHaveBeenCalledWith(mockItems[2])
    })

    it('should use custom isItemDisabled function', () => {
      const isItemDisabled = vi.fn((item: Item) => item.id === 3)

      const wrapper = mount(ItemsSection, {
        props: {
          title: 'Test Section',
          items: mockItems,
          isItemDisabled,
        },
      })

      const itemCards = wrapper.findAllComponents(ItemCard)
      expect(itemCards[0].props('isDisabled')).toBe(false) // id: 1
      expect(itemCards[1].props('isDisabled')).toBe(false) // id: 2
      expect(itemCards[2].props('isDisabled')).toBe(true) // id: 3

      // Verify function was called for each item
      expect(isItemDisabled).toHaveBeenCalledTimes(3)
      expect(isItemDisabled).toHaveBeenCalledWith(mockItems[0])
      expect(isItemDisabled).toHaveBeenCalledWith(mockItems[1])
      expect(isItemDisabled).toHaveBeenCalledWith(mockItems[2])
    })
  })

  describe('event handling', () => {
    it('should emit item-click event when ItemCard is clicked', async () => {
      const wrapper = mount(ItemsSection, {
        props: {
          title: 'Test Section',
          items: mockItems,
        },
      })

      const firstItemCard = wrapper.findAllComponents(ItemCard)[0]
      await firstItemCard.vm.$emit('click', mockItems[0])

      expect(wrapper.emitted('item-click')).toBeTruthy()
      expect(wrapper.emitted('item-click')?.[0]).toEqual([mockItems[0]])
    })

    it('should emit item-click event with correct item for each card', async () => {
      const wrapper = mount(ItemsSection, {
        props: {
          title: 'Test Section',
          items: mockItems,
        },
      })

      const itemCards = wrapper.findAllComponents(ItemCard)

      // Click each item and verify correct event emission
      for (let i = 0; i < itemCards.length; i++) {
        await itemCards[i].vm.$emit('click', mockItems[i])

        const emittedEvents = wrapper.emitted('item-click') as Array<Array<Item>>
        expect(emittedEvents[i]).toEqual([mockItems[i]])
      }

      expect(wrapper.emitted('item-click')).toHaveLength(mockItems.length)
    })
  })

  describe('integration with dynamic data', () => {
    it('should reactively update when items change', async () => {
      const wrapper = mount(ItemsSection, {
        props: {
          title: 'Test Section',
          items: mockItems,
        },
      })

      expect(wrapper.findAllComponents(ItemCard)).toHaveLength(3)

      // Update items
      const newItems = [...mockItems, { id: 4, name: 'Item 4' }]
      await wrapper.setProps({ items: newItems })

      expect(wrapper.findAllComponents(ItemCard)).toHaveLength(4)
    })

    it('should update item states when selection functions change', async () => {
      const initialIsSelected = vi.fn(() => false)
      const wrapper = mount(ItemsSection, {
        props: {
          title: 'Test Section',
          items: mockItems,
          isItemSelected: initialIsSelected,
        },
      })

      let itemCards = wrapper.findAllComponents(ItemCard)
      expect(itemCards[0].props('isSelected')).toBe(false)

      // Change selection function
      const newIsSelected = vi.fn((item: Item) => item.id === 1)
      await wrapper.setProps({ isItemSelected: newIsSelected })

      itemCards = wrapper.findAllComponents(ItemCard)
      expect(itemCards[0].props('isSelected')).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle items with duplicate ids gracefully', () => {
      const duplicateItems = [
        { id: 1, name: 'Item 1' },
        { id: 1, name: 'Item 1 Duplicate' },
      ]

      const wrapper = mount(ItemsSection, {
        props: {
          title: 'Test Section',
          items: duplicateItems,
        },
      })

      const itemCards = wrapper.findAllComponents(ItemCard)
      expect(itemCards).toHaveLength(2)
      expect(itemCards[0].props('item')).toEqual(duplicateItems[0])
      expect(itemCards[1].props('item')).toEqual(duplicateItems[1])
    })

    it('should handle very long item names', () => {
      const longNameItem = { id: 1, name: 'A'.repeat(100) }

      const wrapper = mount(ItemsSection, {
        props: {
          title: 'Test Section',
          items: [longNameItem],
        },
      })

      const itemCard = wrapper.findComponent(ItemCard)
      expect(itemCard.props('item')).toEqual(longNameItem)
    })
  })
})
