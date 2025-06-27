<script setup lang="ts">
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { SUPPORT_LOCALES } from '@/plugins/i18n'

const { locale, t } = useI18n()

const switchLanguage = (lang: string) => {
  locale.value = lang
}

watch(
  () => locale.value,
  (newLang) => {
    localStorage.setItem('locale', newLang)
  },
)
</script>

<template>
  <div class="language-switcher">
    <div class="language-switcher__buttons">
      <button
        v-for="lang in SUPPORT_LOCALES"
        :key="lang"
        :class="[
          `language-switcher__button language-switcher__button--${lang}`,
          { 'language-switcher__button--active': locale === lang },
        ]"
        @click="switchLanguage(lang)"
      >
        {{ t(`LABELS.LANGUAGES.${lang.toUpperCase()}`) }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.language-switcher {
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;

  @media (max-width: 768px) {
    margin-bottom: 15px;
  }

  &__buttons {
    display: flex;
    gap: 10px;
  }

  &__button {
    padding: 6px 12px;
    border: 2px solid #ddd;
    border-radius: 4px;
    background-color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;

    &:hover {
      border-color: #bbb;
      background-color: #f9f9f9;
    }

    &--active {
      background-color: #2196f3;
      border-color: #2196f3;
      color: white;
      font-weight: bold;

      &:hover {
        background-color: #1976d2;
        border-color: #1976d2;
      }
    }
  }
}
</style>
