<script setup lang="ts">
import { inject, type Ref, ref, onMounted, onUnmounted } from 'vue'
import type { messages } from '../i18n'

const lang = inject('lang') as Ref<string>
const msgs = inject('messages') as typeof messages
const menuOpen = ref(false)
const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
  if (menuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMenu = () => {
  menuOpen.value = false
  document.body.style.overflow = ''
}
</script>

<template>
  <header class="header" :class="{ 'menu-open': menuOpen, 'scrolled': isScrolled }">
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

        <button 
          class="mobile-menu-toggle mobile-only" 
          @click="toggleMenu" 
          :aria-expanded="menuOpen"
          :class="{ active: menuOpen }"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </div>

    <div class="mobile-menu" :class="{ open: menuOpen }">
      <nav class="mobile-nav-links">
        <a href="#highlights" @click="closeMenu">{{ msgs[lang as keyof typeof msgs].nav.highlights }}</a>
        <a href="#rooms" @click="closeMenu">{{ msgs[lang as keyof typeof msgs].nav.rooms }}</a>
        <a href="#gallery" @click="closeMenu">{{ msgs[lang as keyof typeof msgs].nav.gallery }}</a>
        <a href="#location" @click="closeMenu">{{ msgs[lang as keyof typeof msgs].nav.location }}</a>
      </nav>
      <div class="mobile-contact">
        <div class="contact-info">
          <div>📞 +66 74 000 000</div>
          <div>✉ info@shatyai.com</div>
        </div>
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
  padding: 32px 48px; /* Initial large padding */
  z-index: 2000;
  background: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, 0);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.header.scrolled {
  padding: 14px 40px;
  background: rgba(12, 12, 12, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.header.menu-open {
  background: rgba(9, 9, 9, 1);
  border-bottom-color: transparent;
  padding-top: 24px;
  padding-bottom: 24px;
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.logo {
  font-family: var(--font-serif);
  font-size: 1.6rem;
  color: var(--color-white);
  letter-spacing: 0.35em;
  text-transform: uppercase;
  position: relative;
  z-index: 2101;
  transition: font-size 0.5s ease;
}

.header.scrolled .logo {
  font-size: 1.25rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 40px;
}

.nav-links {
  display: flex;
  gap: 32px;
}

.nav-item {
  color: #f4f1ed;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  position: relative;
  transition: all 0.3s ease;
}

.nav-item::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 0;
  height: 1px;
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
  gap: 32px;
}

.contact-details {
  display: flex;
  flex-direction: column;
  font-size: 0.75rem;
  color: #c8c2b8;
  gap: 2px;
  transition: opacity 0.3s ease;
}

.header.scrolled .contact-details {
  opacity: 0.8;
}

.lang-switch {
  color: #f4f1ed;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  gap: 10px;
  align-items: center;
}

.lang-switch span {
  transition: color 0.3s ease;
  opacity: 0.6;
}

.lang-switch span.active {
  color: var(--color-accent);
  opacity: 1;
  font-weight: 600;
}

.btn-luxury {
  padding: 12px 28px;
  font-size: 0.75rem;
  transition: all 0.5s ease;
}

.header.scrolled .btn-luxury {
  padding: 10px 24px;
}

/* Mobile Toggle */
.mobile-menu-toggle {
  display: none;
  border: none;
  background: transparent;
  cursor: pointer;
  width: 32px;
  height: 32px;
  position: relative;
  z-index: 2101;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 6px;
}

.mobile-menu-toggle span {
  display: block;
  height: 2px;
  background: #f4f1ed;
  border-radius: 2px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-menu-toggle span:nth-child(1) { width: 32px; }
.mobile-menu-toggle span:nth-child(2) { width: 24px; }
.mobile-menu-toggle span:nth-child(3) { width: 32px; }

.mobile-menu-toggle.active span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
  width: 32px;
}

.mobile-menu-toggle.active span:nth-child(2) {
  opacity: 0;
  transform: translateX(10px);
}

.mobile-menu-toggle.active span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
  width: 32px;
}

/* Mobile Menu */
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #090909;
  padding: 120px 32px 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 2100;
  opacity: 0;
  visibility: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(-10px);
}

.mobile-menu.open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-nav-links a {
  color: #ffffff;
  font-size: 1.8rem;
  font-family: var(--font-serif);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-decoration: none;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: color 0.3s ease;
}

.mobile-nav-links a:active {
  color: var(--color-accent);
}

.mobile-contact {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 32px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.95rem;
  color: #c7c1b5;
}

.mobile-contact .lang-switch {
  font-size: 1.1rem;
  gap: 16px;
}

.mobile-contact .btn-luxury {
  width: 100%;
  padding: 18px;
  font-size: 0.9rem;
  letter-spacing: 0.2em;
}

.mobile-only {
  display: none;
}

@media (max-width: 1024px) {
  .header {
    padding: 24px 32px;
  }
  .header.scrolled {
    padding: 14px 28px;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 20px 24px;
  }
  .header.scrolled {
    padding: 12px 20px;
  }
  .desktop-only {
    display: none;
  }
  .mobile-only {
    display: flex;
  }
  
  .logo {
    font-size: 1.3rem;
  }
  .header.scrolled .logo {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 16px 18px;
  }
  .header.scrolled {
    padding: 10px 16px;
  }
  
  .logo {
    font-size: 1.1rem;
    letter-spacing: 0.25em;
  }
  
  .mobile-menu {
    padding: 100px 24px 32px;
  }
  
  .mobile-nav-links a {
    font-size: 1.5rem;
  }
}
</style>

