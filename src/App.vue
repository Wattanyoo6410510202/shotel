<script setup lang="ts">
import { ref, provide } from 'vue'
import { messages } from './i18n'

const lang = ref('EN')
provide('lang', lang)
provide('messages', messages)
</script>

<template>
  <router-view />
</template>

<style>
/* Global styles can stay here if needed */
</style>
