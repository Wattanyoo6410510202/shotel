<script setup lang="ts">
import { inject, type Ref, computed } from 'vue'
import type { messages } from '../i18n'

const lang = inject('lang') as Ref<keyof typeof messages>
const msgs = inject('messages') as typeof messages

// 👇 ชี้ไปที่ sections เพื่อให้ใช้ t.cookiePolicy ได้เลย
const t = computed(() => msgs[lang.value].sections)
</script>

<template>
  <div class="cookie-policy">
    <div class="container">
      <div class="lang-switch">
        <span
          :class="{ active: lang === 'EN' }"
          @click="lang = 'EN'"
        >
          EN
        </span>
        /
        <span
          :class="{ active: lang === 'TH' }"
          @click="lang = 'TH'"
        >
          TH
        </span>
      </div>

      <h1>{{ t.cookiePolicy.title }}</h1>
      <p>{{ t.cookiePolicy.lastUpdated }}</p>
      
      <h2>{{ t.cookiePolicy.whatTitle }}</h2>
      <p>{{ t.cookiePolicy.whatDesc }}</p>
      
      <h2>{{ t.cookiePolicy.howTitle }}</h2>
      <ul>
        <li>
          <strong>{{ t.cookiePolicy.necessaryTitle }}:</strong>
          {{ t.cookiePolicy.necessaryDesc }}
        </li>
        <li>
          <strong>{{ t.cookiePolicy.analyticsTitle }}:</strong>
          {{ t.cookiePolicy.analyticsDesc }}
        </li>
        <li>
          <strong>{{ t.cookiePolicy.marketingTitle }}:</strong>
          {{ t.cookiePolicy.marketingDesc }}
        </li>
      </ul>
      
      <h2>{{ t.cookiePolicy.choicesTitle }}</h2>
      <p>{{ t.cookiePolicy.choicesDesc }}</p>
    </div>
  </div>
</template>

<style scoped>
.cookie-policy {
  padding: 60px 20px;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}

h1 {
  font-family: var(--font-serif);
  margin-bottom: 20px;
}

h2 {
  margin-top: 30px;
}

.lang-switch {
  margin-bottom: 20px;
  cursor: pointer;
}

.lang-switch .active {
  font-weight: bold;
  text-decoration: underline;
}
</style>