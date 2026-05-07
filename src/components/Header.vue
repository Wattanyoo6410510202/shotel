<script setup lang="ts">
import { inject, type Ref } from 'vue'
import type { messages } from '../i18n'

const lang = inject('lang') as Ref<string>
const msgs = inject('messages') as typeof messages
</script>

<template>
  <header class="header">
    <div class="header-inner">
      <!-- LEFT: Logo -->
      <div class="header-left">
        <div class="logo">S HATYAI</div>
      </div>

      <!-- RIGHT: Nav Links, Contact & Actions -->
      <div class="header-right">
        <nav class="nav-links">
          <a href="#highlights" class="nav-item">{{ msgs[lang as keyof typeof msgs].nav.highlights }}</a>
          <a href="#rooms" class="nav-item">{{ msgs[lang as keyof typeof msgs].nav.rooms }}</a>
          <a href="#gallery" class="nav-item">{{ msgs[lang as keyof typeof msgs].nav.gallery }}</a>
          <a href="#location" class="nav-item">{{ msgs[lang as keyof typeof msgs].nav.location }}</a>
        </nav>
        
        <div class="contact-actions">
          <div class="contact-details">
            <span>📞 +66 74 000 000</span>
            <span>✉ info@shatyai.com</span>
          </div>
          <div class="lang-switch">
            <span :class="{ active: lang === 'EN' }" @click="lang = 'EN'">EN</span>
            <span class="divider">/</span>
            <span :class="{ active: lang === 'TH' }" @click="lang = 'TH'">TH</span>
          </div>
          <button class="btn-luxury">{{ msgs[lang as keyof typeof msgs].nav.book }}</button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 15px 40px;
  z-index: 1000;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(15px);
  border-bottom: 1px solid rgba(197, 160, 89, 0.2);
  transition: all 0.4s ease;
}
.header-inner { display: flex; justify-content: space-between; align-items: center; width: 100%; }

.header-left { display: flex; justify-content: flex-start; }
.header-right { display: flex; align-items: center; gap: 40px; }

.logo { font-family: var(--font-serif); font-size: 1.5rem; color: var(--color-white); letter-spacing: 0.3em; text-transform: uppercase; cursor: pointer; }

.nav-links { display: flex; gap: 40px; }
.nav-item { 
  color: #fff; 
  text-decoration: none; 
  text-transform: uppercase; 
  font-size: 0.75rem; 
  letter-spacing: 0.2em; 
  position: relative;
  transition: color 0.3s ease;
}
.nav-item::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 0;
  height: 1px;
  background-color: var(--color-accent);
  transition: width 0.3s ease;
}
.nav-item:hover { color: var(--color-accent); }
.nav-item:hover::after { width: 100%; }

.contact-actions { display: flex; align-items: center; gap: 30px; }
.contact-details { display: flex; flex-direction: column; font-size: 0.65rem; color: #aaa; }
.lang-switch { color: white; font-size: 0.7rem; cursor: pointer; display: flex; gap: 5px; }
.lang-switch span.active { color: var(--color-accent); font-weight: bold; }

@media (max-width: 768px) {
  .nav-links, .contact-details { display: none; }
}
</style>
