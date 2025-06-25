import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ItemCard from '../ItemCard.vue'
import type { Item } from '@/types/item'

describe('ItemCard', () => {
  const mockItem: Item = { id: 1, name: 'Test Item' }

  describe('rendering', () => {
    it('should render item name', () => {
      const wrapper = mount(ItemCard, {
        props: { item: mockItem },
      })

      expect(wrapper.text()).toContain('Test Item')
    })

    it('should apply selected class when isSelected is true', () => {
      const wrapper = mount(ItemCard, {
        props: {
          item: mockItem,
          isSelected: true,
        },
      })

      expect(wrapper.find('.item-card').classes()).toContain('selected')
    })

    it('should apply disabled class when isDisabled is true', () => {
      const wrapper = mount(ItemCard, {
        props: {
          item: mockItem,
          isDisabled: true,
        },
      })

      expect(wrapper.find('.item-card').classes()).toContain('disabled')
    })

    it('should show remove button when showRemoveButton is true', () => {
      const wrapper = mount(ItemCard, {
        props: {
          item: mockItem,
          showRemoveButton: true,
        },
      })

      expect(wrapper.find('.item-card__remove-btn').exists()).toBe(true)
    })

    it('should not show remove button by default', () => {
      const wrapper = mount(ItemCard, {
        props: { item: mockItem },
      })

      expect(wrapper.find('.item-card__remove-btn').exists()).toBe(false)
    })
  })

  describe('click behavior', () => {
    it('should emit click event with item when clicked and not disabled', async () => {
      const wrapper = mount(ItemCard, {
        props: { item: mockItem },
      })

      await wrapper.find('.item-card').trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')?.[0]).toEqual([mockItem])
    })

    it('should not emit click event when disabled', async () => {
      const wrapper = mount(ItemCard, {
        props: {
          item: mockItem,
          isDisabled: true,
        },
      })

      await wrapper.find('.item-card').trigger('click')

      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('should emit click event when selected but not disabled', async () => {
      const wrapper = mount(ItemCard, {
        props: {
          item: mockItem,
          isSelected: true,
        },
      })

      await wrapper.find('.item-card').trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')?.[0]).toEqual([mockItem])
    })
  })

  describe('remove button behavior', () => {
    it('should emit remove event with item when remove button is clicked', async () => {
      const wrapper = mount(ItemCard, {
        props: {
          item: mockItem,
          showRemoveButton: true,
        },
      })

      await wrapper.find('.item-card__remove-btn').trigger('click')

      expect(wrapper.emitted('remove')).toBeTruthy()
      expect(wrapper.emitted('remove')?.[0]).toEqual([mockItem])
    })

    it('should stop propagation when remove button is clicked', async () => {
      const wrapper = mount(ItemCard, {
        props: {
          item: mockItem,
          showRemoveButton: true,
        },
      })

      await wrapper.find('.item-card__remove-btn').trigger('click')

      // Click event should not be emitted when remove button is clicked
      expect(wrapper.emitted('click')).toBeFalsy()
    })
  })

  describe('prop defaults', () => {
    it('should use default values for optional props', () => {
      const wrapper = mount(ItemCard, {
        props: { item: mockItem },
      })

      const itemElement = wrapper.find('.item-card')
      expect(itemElement.classes()).not.toContain('selected')
      expect(itemElement.classes()).not.toContain('disabled')
      expect(wrapper.find('.item-card__remove-btn').exists()).toBe(false)
    })
  })

  describe('accessibility', () => {
    it('should be clickable when not disabled', () => {
      const wrapper = mount(ItemCard, {
        props: { item: mockItem },
      })

      const itemElement = wrapper.find('.item-card')

      if (itemElement.attributes('style')) {
        expect(itemElement.attributes('style')).not.toContain('cursor: not-allowed')
      }
    })

    it('should show visual feedback for disabled state', () => {
      const wrapper = mount(ItemCard, {
        props: {
          item: mockItem,
          isDisabled: true,
        },
      })

      expect(wrapper.find('.item-card').classes()).toContain('disabled')
    })
  })

  describe('multiple states combination', () => {
    it('should handle selected and disabled states together', () => {
      const wrapper = mount(ItemCard, {
        props: {
          item: mockItem,
          isSelected: true,
          isDisabled: true,
        },
      })

      const itemElement = wrapper.find('.item-card')
      expect(itemElement.classes()).toContain('selected')
      expect(itemElement.classes()).toContain('disabled')
    })

    it('should handle selected state with remove button', () => {
      const wrapper = mount(ItemCard, {
        props: {
          item: mockItem,
          isSelected: true,
          showRemoveButton: true,
        },
      })

      expect(wrapper.find('.item-card').classes()).toContain('selected')
      expect(wrapper.find('.item-card__remove-btn').exists()).toBe(true)
    })

    it('should handle disabled state with remove button', async () => {
      const wrapper = mount(ItemCard, {
        props: {
          item: mockItem,
          isDisabled: true,
          showRemoveButton: true,
        },
      })

      // Remove button should still work even when item is disabled
      await wrapper.find('.item-card__remove-btn').trigger('click')
      expect(wrapper.emitted('remove')).toBeTruthy()

      // But main click should not work
      await wrapper.find('.item-card').trigger('click')
      expect(wrapper.emitted('click')).toBeFalsy()
    })
  })
})
