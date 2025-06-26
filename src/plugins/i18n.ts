import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import ru from '@/locales/ru.json'

export type MessageLanguages = keyof typeof en

export const SUPPORT_LOCALES = ['en', 'ru']

export function setupI18n(options = { locale: 'en' }) {
  const i18n = createI18n({
    legacy: false,
    locale: options.locale,
    fallbackLocale: 'en',
    messages: {
      en,
      ru,
    },
  })
  return i18n
}
