import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SelectedItemsSection from '../SelectedItemsSection.vue'
import ItemCard from '../ItemCard.vue'
import type { Item } from '@/types/item'

describe('SelectedItemsSection', () => {
  const mockItems: Item[] = [
    { id: 1, name: 'Selected Item 1' },
    { id: 2, name: 'Selected Item 2' },
    { id: 3, name: 'Selected Item 3' },
  ]

  describe('rendering', () => {
    it('should render title', () => {
      const wrapper = mount(SelectedItemsSection, {
        props: {
          title: 'Selected Items',
          selectedItems: mockItems,
        },
      })

      expect(wrapper.find('h3').text()).toBe('Selected Items')
    })

    it('should render all selected items', () => {
      const wrapper = mount(SelectedItemsSection, {
        props: {
          title: 'Selected Items',
          selectedItems: mockItems,
        },
      })

      const itemCards = wrapper.findAllComponents(ItemCard)
      expect(itemCards).toHaveLength(mockItems.length)
    })

    it('should show placeholder when no items selected', () => {
      const wrapper = mount(SelectedItemsSection, {
        props: {
          title: 'Selected Items',
          selectedItems: [],
        },
      })

      expect(wrapper.find('.placeholder').exists()).toBe(true)
      expect(wrapper.find('.placeholder').text()).toBe('No items selected')
    })

    it('should show custom placeholder text', () => {
      const customPlaceholder = 'Please select some items'
      const wrapper = mount(SelectedItemsSection, {
        props: {
          title: 'Selected Items',
          selectedItems: [],
          placeholderText: customPlaceholder,
        },
      })

      expect(wrapper.find('.placeholder').text()).toBe(customPlaceholder)
    })

    it('should not show placeholder when items are selected', () => {
      const wrapper = mount(SelectedItemsSection, {
        props: {
          title: 'Selected Items',
          selectedItems: mockItems,
        },
      })

      expect(wrapper.find('.placeholder').exists()).toBe(false)
    })
  })

  describe('item properties', () => {
    it('should pass correct item prop to each ItemCard', () => {
      const wrapper = mount(SelectedItemsSection, {
        props: {
          title: 'Selected Items',
          selectedItems: mockItems,
        },
      })

      const itemCards = wrapper.findAllComponents(ItemCard)
      itemCards.forEach((card, index) => {
        expect(card.props('item')).toEqual(mockItems[index])
      })
    })

    it('should set showRemoveButton to true for all items', () => {
      const wrapper = mount(SelectedItemsSection, {
        props: {
          title: 'Selected Items',
          selectedItems: mockItems,
        },
      })

      const itemCards = wrapper.findAllComponents(ItemCard)
      itemCards.forEach((card) => {
        expect(card.props('showRemoveButton')).toBe(true)
      })
    })

    it('should not set isSelected or isDisabled props', () => {
      const wrapper = mount(SelectedItemsSection, {
        props: {
          title: 'Selected Items',
          selectedItems: mockItems,
        },
      })

      const itemCards = wrapper.findAllComponents(ItemCard)
      itemCards.forEach((card) => {
        expect(card.props('isSelected')).toBe(false) // Default value
        expect(card.props('isDisabled')).toBe(false) // Default value
      })
    })
  })

  describe('event handling', () => {
    it('should emit item-remove event when ItemCard remove is triggered', async () => {
      const wrapper = mount(SelectedItemsSection, {
        props: {
          title: 'Selected Items',
          selectedItems: mockItems,
        },
      })

      const firstItemCard = wrapper.findAllComponents(ItemCard)[0]
      await firstItemCard.vm.$emit('remove', mockItems[0])

      expect(wrapper.emitted('item-remove')).toBeTruthy()
      expect(wrapper.emitted('item-remove')?.[0]).toEqual([mockItems[0]])
    })

    it('should emit item-remove event with correct item for each card', async () => {
      const wrapper = mount(SelectedItemsSection, {
        props: {
          title: 'Selected Items',
          selectedItems: mockItems,
        },
      })

      const itemCards = wrapper.findAllComponents(ItemCard)

      // Remove each item and verify correct event emission
      for (let i = 0; i < itemCards.length; i++) {
        await itemCards[i].vm.$emit('remove', mockItems[i])

        const emittedEvents = wrapper.emitted('item-remove') as Array<Array<Item>>
        expect(emittedEvents[i]).toEqual([mockItems[i]])
      }

      expect(wrapper.emitted('item-remove')).toHaveLength(mockItems.length)
    })
  })

  describe('reactive updates', () => {
    it('should show placeholder when selectedItems becomes empty', async () => {
      const wrapper = mount(SelectedItemsSection, {
        props: {
          title: 'Selected Items',
          selectedItems: mockItems,
        },
      })

      expect(wrapper.find('.placeholder').exists()).toBe(false)

      // Update to empty array
      await wrapper.setProps({ selectedItems: [] })

      expect(wrapper.find('.placeholder').exists()).toBe(true)
    })

    it('should hide placeholder when items are added', async () => {
      const wrapper = mount(SelectedItemsSection, {
        props: {
          title: 'Selected Items',
          selectedItems: [],
        },
      })

      expect(wrapper.find('.placeholder').exists()).toBe(true)

      // Add items
      await wrapper.setProps({ selectedItems: [mockItems[0]] })

      expect(wrapper.find('.placeholder').exists()).toBe(false)
      expect(wrapper.findAllComponents(ItemCard)).toHaveLength(1)
    })

    it('should update items count when selectedItems changes', async () => {
      const wrapper = mount(SelectedItemsSection, {
        props: {
          title: 'Selected Items',
          selectedItems: [mockItems[0]],
        },
      })

      expect(wrapper.findAllComponents(ItemCard)).toHaveLength(1)

      // Add more items
      await wrapper.setProps({ selectedItems: mockItems })

      expect(wrapper.findAllComponents(ItemCard)).toHaveLength(mockItems.length)
    })
  })

  describe('prop defaults', () => {
    it('should use default placeholder text when not provided', () => {
      const wrapper = mount(SelectedItemsSection, {
        props: {
          title: 'Selected Items',
          selectedItems: [],
        },
      })

      expect(wrapper.find('.placeholder').text()).toBe('No items selected')
    })
  })

  describe('edge cases', () => {
    it('should handle single item selection', () => {
      const singleItem = [mockItems[0]]
      const wrapper = mount(SelectedItemsSection, {
        props: {
          title: 'Selected Items',
          selectedItems: singleItem,
        },
      })

      const itemCards = wrapper.findAllComponents(ItemCard)
      expect(itemCards).toHaveLength(1)
      expect(itemCards[0].props('item')).toEqual(mockItems[0])
      expect(wrapper.find('.placeholder').exists()).toBe(false)
    })

    it('should handle items with very long names', () => {
      const longNameItem = { id: 999, name: 'Very '.repeat(20) + 'Long Item Name' }
      const wrapper = mount(SelectedItemsSection, {
        props: {
          title: 'Selected Items',
          selectedItems: [longNameItem],
        },
      })

      const itemCard = wrapper.findComponent(ItemCard)
      expect(itemCard.props('item')).toEqual(longNameItem)
    })

    it('should handle rapid selection changes', async () => {
      const wrapper = mount(SelectedItemsSection, {
        props: {
          title: 'Selected Items',
          selectedItems: [],
        },
      })

      // Rapid changes
      await wrapper.setProps({ selectedItems: [mockItems[0]] })
      await wrapper.setProps({ selectedItems: mockItems })
      await wrapper.setProps({ selectedItems: [mockItems[1]] })
      await wrapper.setProps({ selectedItems: [] })

      expect(wrapper.find('.placeholder').exists()).toBe(true)
      expect(wrapper.findAllComponents(ItemCard)).toHaveLength(0)
    })

    it('should handle empty placeholder text', () => {
      const wrapper = mount(SelectedItemsSection, {
        props: {
          title: 'Selected Items',
          selectedItems: [],
          placeholderText: '',
        },
      })

      expect(wrapper.find('.placeholder').text()).toBe('')
      expect(wrapper.find('.placeholder').exists()).toBe(true)
    })
  })
})
