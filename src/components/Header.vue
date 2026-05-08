<script setup lang="ts">
import { inject, type Ref, ref } from 'vue'
import type { messages } from '../i18n'

const lang = inject('lang') as Ref<string>
const msgs = inject('messages') as typeof messages
const menuOpen = ref(false)
</script>

<template>
  <header class="header">
    <div class="header-inner">
      <div class="header-left">
        <div class="logo">S HATYAI</div>
      </div>

      <nav class="header-right">
        <div class="nav-links desktop-only">
          <a href="#highlights" class="nav-item">{{ msgs[lang as keyof typeof msgs].nav.highlights }}</a>
          <a href="#rooms" class="nav-item">{{ msgs[lang as keyof typeof msgs].nav.rooms }}</a>
          <a href="#gallery" class="nav-item">{{ msgs[lang as keyof typeof msgs].nav.gallery }}</a>
          <a href="#location" class="nav-item">{{ msgs[lang as keyof typeof msgs].nav.location }}</a>
        </div>

        <div class="contact-actions desktop-only">
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

        <button class="mobile-menu-toggle mobile-only" @click="menuOpen = !menuOpen" :aria-expanded="menuOpen">
          <span :class="{ active: menuOpen }"></span>
          <span :class="{ active: menuOpen }"></span>
          <span :class="{ active: menuOpen }"></span>
        </button>
      </nav>
    </div>

    <div class="mobile-menu" :class="{ open: menuOpen }">
      <nav class="mobile-nav-links">
        <a href="#highlights" @click="menuOpen = false">{{ msgs[lang as keyof typeof msgs].nav.highlights }}</a>
        <a href="#rooms" @click="menuOpen = false">{{ msgs[lang as keyof typeof msgs].nav.rooms }}</a>
        <a href="#gallery" @click="menuOpen = false">{{ msgs[lang as keyof typeof msgs].nav.gallery }}</a>
        <a href="#location" @click="menuOpen = false">{{ msgs[lang as keyof typeof msgs].nav.location }}</a>
      </nav>
      <div class="mobile-contact">
        <div>📞 +66 74 000 000</div>
        <div>✉ info@shatyai.com</div>
        <div class="lang-switch">
          <span :class="{ active: lang === 'EN' }" @click="lang = 'EN'">EN</span>
          <span class="divider">/</span>
          <span :class="{ active: lang === 'TH' }" @click="lang = 'TH'">TH</span>
        </div>
        <button class="btn-luxury">{{ msgs[lang as keyof typeof msgs].nav.book }}</button>
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
  padding: 10px 18px;
  z-index: 1000;
  background: rgba(22, 22, 22, 0.88);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
}
.header-left {
  display: flex;
  align-items: center;
}
.logo {
  font-family: var(--font-serif);
  font-size: 1.45rem;
  color: var(--color-white);
  letter-spacing: 0.32em;
  text-transform: uppercase;
}
.header-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  gap: 28px;
}
.nav-links {
  display: flex;
  gap: 28px;
}
.nav-item {
  color: #f4f1ed;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  position: relative;
  transition: color 0.25s ease;
}
.nav-item::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 0;
  height: 2px;
  background-color: var(--color-accent);
  transition: width 0.3s ease;
}
.nav-item:hover {
  color: var(--color-accent);
}
.nav-item:hover::after {
  width: 100%;
}
.contact-actions {
  display: flex;
  align-items: center;
  gap: 24px;
}
.contact-details {
  display: flex;
  flex-direction: column;
  font-size: 0.72rem;
  color: #c8c2b8;
  gap: 4px;
}
.lang-switch {
  color: #f4f1ed;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  gap: 8px;
}
.lang-switch span.active {
  color: var(--color-accent);
  font-weight: 700;
}
.mobile-menu-toggle {
  display: none;
  border: none;
  background: transparent;
  cursor: pointer;
  width: 32px;
  height: 24px;
  flex-direction: column;
  justify-content: space-between;
  padding: 0;
}
.mobile-menu-toggle span {
  display: block;
  height: 2.5px;
  width: 100%;
  background: #f4f1ed;
  border-radius: 999px;
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.mobile-menu-toggle span.active:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}
.mobile-menu-toggle span.active:nth-child(2) {
  opacity: 0;
}
.mobile-menu-toggle span.active:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}
.mobile-menu {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(9, 9, 9, 0.96);
  padding: 72px 24px 28px;
  transition: transform 0.35s ease, opacity 0.35s ease;
  transform: translateY(-10px);
  opacity: 0;
  z-index: 1100;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.mobile-menu.open {
  display: block;
  transform: translateY(0);
  opacity: 1;
}
.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 28px;
}
.mobile-nav-links a {
  color: #ffffff;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  text-decoration: none;
  padding: 14px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.mobile-contact {
  display: flex;
  flex-direction: column;
  gap: 14px;
  font-size: 0.88rem;
  color: #c7c1b5;
}
.mobile-contact div {
  display: flex;
  align-items: center;
  gap: 10px;
}
.mobile-contact .lang-switch {
  gap: 10px;
}
.mobile-contact .btn-luxury {
  width: 100%;
  justify-content: center;
  padding: 14px 18px;
  font-size: 0.88rem;
  border-radius: 999px;
}
.mobile-only {
  display: none;
}
.desktop-only {
  display: flex;
}
@media (max-width: 900px) {
  .header {
    padding: 16px 24px;
  }
  .header-right {
    gap: 20px;
  }
}
@media (max-width: 768px) {
  .header {
    padding: 14px 16px;
  }
  .desktop-only {
    display: none;
  }
  .mobile-only {
    display: flex;
  }
  .header-inner {
    align-items: center;
  }
}

@media (max-width: 540px) {
  .header {
    padding: 12px 14px;
  }
  .logo {
    font-size: 1.1rem;
    letter-spacing: 0.28em;
  }
  .mobile-menu-toggle {
    width: 34px;
    height: 26px;
  }
  .mobile-menu {
    padding: 18px 20px 22px;
  }
  .mobile-nav-links {
    gap: 14px;
    margin-bottom: 20px;
  }
  .mobile-nav-links a {
    font-size: 0.88rem;
    letter-spacing: 0.12em;
  }
  .mobile-contact {
    font-size: 0.82rem;
    gap: 10px;
  }
}
</style>
