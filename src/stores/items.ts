import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Item } from '@/types/item'

export const useItemsStore = defineStore('items', () => {
  const userItems = ref<Item[]>([])
  const isLoadingUserItems = ref(false)
  async function getUserItems() {
    isLoadingUserItems.value = true
    try {
      userItems.value = await new Promise<Item[]>((resolve) => {
        setTimeout(() => {
          resolve([
            { id: 1, name: 'Shoes 1' },
            { id: 2, name: 'Shoes 2' },
            { id: 3, name: 'Shoes 3' },
            { id: 4, name: 'Shoes 4' },
            { id: 5, name: 'T-shirt 1' },
            { id: 6, name: 'T-shirt 2' },
            { id: 7, name: 'T-shirt 3' },
            { id: 8, name: 'T-shirt 4' },
          ])
        }, 1000)
      })
    } catch (error) {
      console.error('Error fetching user items:', error)
    } finally {
      isLoadingUserItems.value = false
    }
  }

  const choiceItems = ref<Item[]>([])
  const isLoadingChoiceItems = ref(false)
  async function getChoiceItems() {
    isLoadingChoiceItems.value = true
    try {
      choiceItems.value = await new Promise<Item[]>((resolve) => {
        setTimeout(() => {
          resolve([
            { id: 11, name: 'Jacket 1' },
            { id: 12, name: 'Jacket 2' },
            { id: 13, name: 'Jacket 3' },
            { id: 14, name: 'Jacket 4' },
            { id: 15, name: 'Hoodie 1' },
            { id: 16, name: 'Hoodie 2' },
            { id: 17, name: 'Hoodie 3' },
            { id: 18, name: 'Hoodie 4' },
          ])
        }, 1000)
      })
    } catch (error) {
      console.error('Error fetching choice items:', error)
    } finally {
      isLoadingChoiceItems.value = false
    }
  }

  return {
    userItems,
    isLoadingUserItems,
    getUserItems,
    choiceItems,
    isLoadingChoiceItems,
    getChoiceItems,
  }
})
