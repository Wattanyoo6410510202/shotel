<script setup lang="ts">
import { ref, provide,  } from 'vue'
import { messages } from './i18n'

const savedLang = localStorage.getItem('lang') || 'EN'
const lang = ref<'EN' | 'TH'>(savedLang as 'EN' | 'TH')

const updateLang = (newLang: 'EN' | 'TH') => {
  lang.value = newLang
  localStorage.setItem('lang', newLang)
}

provide('lang', lang)
provide('updateLang', updateLang)
provide('messages', messages)
</script>

<template>
  <router-view />
</template>

<style>
/* Global styles can stay here if needed */
</style>
