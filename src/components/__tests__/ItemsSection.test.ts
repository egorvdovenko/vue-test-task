import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ItemsSection from '../ItemsSection.vue'
import type { Item } from '@/types/item'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'LABELS.ITEMS_LOADING': 'Loading user items...',
      }
      return translations[key] || key
    },
  }),
}))

describe('ItemsSection', () => {
  const mockItems: Item[] = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ]

  const defaultProps = {
    title: 'Test Section',
    items: mockItems,
  }

  describe('Loading state logic', () => {
    it('should show loading message when isLoading is true', () => {
      const wrapper = mount(ItemsSection, {
        props: {
          ...defaultProps,
          isLoading: true,
        },
      })

      expect(wrapper.find('.items-section__loading').exists()).toBe(true)
      expect(wrapper.find('.items-section__grid').exists()).toBe(false)
    })

    it('should show grid when isLoading is false', () => {
      const wrapper = mount(ItemsSection, {
        props: {
          ...defaultProps,
          isLoading: false,
        },
      })

      expect(wrapper.find('.items-section__loading').exists()).toBe(false)
      expect(wrapper.find('.items-section__grid').exists()).toBe(true)
    })

    it('should toggle between loading and content states', async () => {
      const wrapper = mount(ItemsSection, {
        props: {
          ...defaultProps,
          isLoading: true,
        },
      })

      expect(wrapper.find('.items-section__loading').exists()).toBe(true)
      expect(wrapper.find('.items-section__grid').exists()).toBe(false)

      await wrapper.setProps({ isLoading: false })
      expect(wrapper.find('.items-section__loading').exists()).toBe(false)
      expect(wrapper.find('.items-section__grid').exists()).toBe(true)
    })
  })

  describe('Empty state logic', () => {
    it('should show placeholder when items array is empty and placeholder is provided', () => {
      const wrapper = mount(ItemsSection, {
        props: {
          title: 'Empty Section',
          items: [],
          placeholder: 'No items available',
          isLoading: false,
        },
      })

      expect(wrapper.find('.items-section__placeholder').exists()).toBe(true)
    })

    it('should not show placeholder when items array is not empty', () => {
      const wrapper = mount(ItemsSection, {
        props: {
          ...defaultProps,
          placeholder: 'No items available',
        },
      })

      expect(wrapper.find('.items-section__placeholder').exists()).toBe(false)
    })

    it('should not show placeholder when items array is empty but no placeholder is provided', () => {
      const wrapper = mount(ItemsSection, {
        props: {
          title: 'Empty Section',
          items: [],
          isLoading: false,
        },
      })

      expect(wrapper.find('.items-section__placeholder').exists()).toBe(false)
    })

    it('should not show placeholder when loading', () => {
      const wrapper = mount(ItemsSection, {
        props: {
          title: 'Loading Section',
          items: [],
          placeholder: 'No items available',
          isLoading: true,
        },
      })

      expect(wrapper.find('.items-section__loading').exists()).toBe(true)
      expect(wrapper.find('.items-section__placeholder').exists()).toBe(false)
      expect(wrapper.find('.items-section__grid').exists()).toBe(false)
    })
  })

  describe('Slot functionality', () => {
    it('should render slot content when items are available', () => {
      const wrapper = mount(ItemsSection, {
        props: defaultProps,
        slots: {
          default: '<div class="custom-content">Custom slot content</div>',
        },
      })

      expect(wrapper.find('.custom-content').exists()).toBe(true)
      expect(wrapper.text()).toContain('Custom slot content')
    })

    it('should render slot even when items array is empty but not show placeholder', () => {
      const wrapper = mount(ItemsSection, {
        props: {
          title: 'Test',
          items: [],
          isLoading: false,
        },
        slots: {
          default: '<div class="empty-slot">Empty slot content</div>',
        },
      })

      expect(wrapper.find('.empty-slot').exists()).toBe(true)
      expect(wrapper.find('.items-section__placeholder').exists()).toBe(false)
    })

    it('should not render slot when loading', () => {
      const wrapper = mount(ItemsSection, {
        props: {
          ...defaultProps,
          isLoading: true,
        },
        slots: {
          default: '<div class="slot-content">Should not render</div>',
        },
      })

      expect(wrapper.find('.slot-content').exists()).toBe(false)
      expect(wrapper.find('.items-section__loading').exists()).toBe(true)
      expect(wrapper.find('.items-section__grid').exists()).toBe(false)
    })
  })
})
