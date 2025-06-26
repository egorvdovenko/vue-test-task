import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import LanguageSwitcher from '../LanguageSwitcher.vue'
import { SUPPORT_LOCALES } from '@/plugins/i18n'

const messages = {
  en: {
    language: 'Language',
    languages: {
      en: 'LABELS.LANGUAGES.EN',
      ru: 'LABELS.LANGUAGES.RU',
    },
  },
  ru: {
    language: 'Язык',
    languages: {
      en: 'Английский',
      ru: 'Русский',
    },
  },
}

const createI18nForTest = (locale = 'en') => {
  return createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    messages,
  })
}

describe('LanguageSwitcher', () => {
  describe('Business Logic', () => {
    it('should have correct supported locales', () => {
      expect(SUPPORT_LOCALES).toEqual(['en', 'ru'])
      expect(SUPPORT_LOCALES).toHaveLength(2)
    })

    it('should initialize with default locale', () => {
      const i18n = createI18nForTest('en')
      mount(LanguageSwitcher, {
        global: {
          plugins: [i18n],
        },
      })

      expect(i18n.global.locale.value).toBe('en')
    })

    it('should switch locale when switchLanguage is called', async () => {
      const i18n = createI18nForTest('en')
      const wrapper = mount(LanguageSwitcher, {
        global: {
          plugins: [i18n],
        },
      })

      expect(i18n.global.locale.value).toBe('en')

      const russianButton = wrapper.find('button.language-switcher__button--ru')
      await russianButton.trigger('click')

      expect(i18n.global.locale.value).toBe('ru')
    })

    it('should apply active class to current locale button', () => {
      const i18n = createI18nForTest('en')
      const wrapper = mount(LanguageSwitcher, {
        global: {
          plugins: [i18n],
        },
      })

      const buttons = wrapper.findAll('.language-switcher__button')
      const englishButton = buttons.find((button) => button.text() === 'LABELS.LANGUAGES.EN')
      const russianButton = buttons.find((button) => button.text() === 'LABELS.LANGUAGES.RU')

      expect(englishButton?.classes()).toContain('language-switcher__button--active')
      expect(russianButton?.classes()).not.toContain('language-switcher__button--active')
    })

    it('should update active class when locale changes', async () => {
      const i18n = createI18nForTest('en')
      const wrapper = mount(LanguageSwitcher, {
        global: {
          plugins: [i18n],
        },
      })

      const buttons = wrapper.findAll('.language-switcher__button')
      const englishButton = buttons.find((button) => button.text() === 'LABELS.LANGUAGES.EN')
      const russianButton = buttons.find((button) => button.text() === 'LABELS.LANGUAGES.RU')

      expect(englishButton?.classes()).toContain('language-switcher__button--active')
      expect(russianButton?.classes()).not.toContain('language-switcher__button--active')

      await russianButton?.trigger('click')
      await wrapper.vm.$nextTick()

      expect(englishButton?.classes()).not.toContain('language-switcher__button--active')
      expect(russianButton?.classes()).toContain('language-switcher__button--active')
    })

    it('should render correct number of language buttons', () => {
      const i18n = createI18nForTest('en')
      const wrapper = mount(LanguageSwitcher, {
        global: {
          plugins: [i18n],
        },
      })

      const buttons = wrapper.findAll('.language-switcher__button')
      expect(buttons).toHaveLength(SUPPORT_LOCALES.length)
      expect(buttons).toHaveLength(2)
    })

    it('should maintain locale state across multiple switches', async () => {
      const i18n = createI18nForTest('en')
      const wrapper = mount(LanguageSwitcher, {
        global: {
          plugins: [i18n],
        },
      })

      const buttons = wrapper.findAll('.language-switcher__button')
      const englishButton = buttons.find((button) => button.text() === 'LABELS.LANGUAGES.EN')
      const russianButton = buttons.find((button) => button.text() === 'LABELS.LANGUAGES.RU')

      expect(i18n.global.locale.value).toBe('en')

      await russianButton?.trigger('click')
      expect(i18n.global.locale.value).toBe('ru')

      await englishButton?.trigger('click')
      expect(i18n.global.locale.value).toBe('en')

      await russianButton?.trigger('click')
      expect(i18n.global.locale.value).toBe('ru')
    })

    it('should handle edge cases gracefully', () => {
      const i18n = createI18nForTest('ru')
      const wrapper = mount(LanguageSwitcher, {
        global: {
          plugins: [i18n],
        },
      })

      expect(i18n.global.locale.value).toBe('ru')

      const buttons = wrapper.findAll('.language-switcher__button')
      const russianButton = buttons.find((button) => button.text() === 'LABELS.LANGUAGES.RU')

      expect(russianButton?.classes()).toContain('language-switcher__button--active')
    })

    it('should expose correct component structure', () => {
      const i18n = createI18nForTest('en')
      const wrapper = mount(LanguageSwitcher, {
        global: {
          plugins: [i18n],
        },
      })

      expect(wrapper.find('.language-switcher').exists()).toBe(true)
      expect(wrapper.find('.language-switcher__label').exists()).toBe(true)
      expect(wrapper.find('.language-switcher__buttons').exists()).toBe(true)
      expect(wrapper.findAll('.language-switcher__button')).toHaveLength(2)
    })
  })

  describe('Locale Integration', () => {
    it('should work with different initial locales', () => {
      const testCases = ['en', 'ru']

      testCases.forEach((locale) => {
        const i18n = createI18nForTest(locale)
        const wrapper = mount(LanguageSwitcher, {
          global: {
            plugins: [i18n],
          },
        })

        expect(i18n.global.locale.value).toBe(locale)

        const buttons = wrapper.findAll('.language-switcher__button')
        const activeButton = buttons.find((button) =>
          button.classes().includes('language-switcher__button--active'),
        )

        expect(activeButton).toBeDefined()
      })
    })

    it('should maintain consistency between locale value and active button', async () => {
      const i18n = createI18nForTest('en')
      const wrapper = mount(LanguageSwitcher, {
        global: {
          plugins: [i18n],
        },
      })

      for (const locale of SUPPORT_LOCALES) {
        i18n.global.locale.value = locale as 'en' | 'ru'
        await wrapper.vm.$nextTick()

        const buttons = wrapper.findAll('.language-switcher__button')
        const activeButtons = buttons.filter((button) =>
          button.classes().includes('language-switcher__button--active'),
        )

        expect(activeButtons).toHaveLength(1)
        expect(i18n.global.locale.value).toBe(locale)
      }
    })
  })
})
