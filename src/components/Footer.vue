<script setup lang="ts">
import { inject, type Ref, ref, onMounted } from 'vue'
import { trackEvent } from '../lib/tracker'
import { setCookie } from '../lib/cookie'

const lang = inject('lang') as Ref<'EN' | 'TH'>
const showCookieModal = ref(false)
const showSettings = ref(false)

const cookiePrefs = ref({
  necessary: true,
  analytics: true,
  marketing: false
})

onMounted(() => {
  const hasAccepted = localStorage.getItem('cookie_accepted')
  if (!hasAccepted) {
    showCookieModal.value = true
  }
})

const acceptCookies = () => {
  localStorage.setItem('cookie_accepted', 'true')
  cookiePrefs.value = { necessary: true, analytics: true, marketing: true }
  localStorage.setItem('cookie_prefs', JSON.stringify(cookiePrefs.value))
  trackEvent('cookie_consent', 'accept')
  showCookieModal.value = false
}

const denyCookies = () => {
  trackEvent('cookie_consent', 'deny', {}, true)
  localStorage.setItem('cookie_accepted', 'false')
  showCookieModal.value = false
}

const saveSettings = () => {
  localStorage.setItem('cookie_accepted', 'true')
  localStorage.setItem('cookie_prefs', JSON.stringify(cookiePrefs.value))
  showCookieModal.value = false
  trackEvent('cookie_consent', 'custom_settings')
}
</script>

<template>
  <footer class="footer">
    <div class="container footer-grid">
      <div class="brand">
        <h3>S HATYAI</h3>
        <p>Experience the ultimate comfort and elegance in Hatyai.</p>
      </div>
      <div>
        <h4>Navigate</h4>
        <ul>
          <li><a href="#highlights">Highlights</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#location">Location</a></li>
        </ul>
      </div>
      <div>
        <h4>Contact</h4>
        <p>123 Luxury Rd, Hatyai</p>
        <p>info@shatyai.com</p>
      </div>
    </div>
    <p class="copyright">&copy; 2026 S HATYAI HOTEL. All rights reserved. | <router-link to="/cookie-policy">Cookie Policy</router-link></p>

    <!-- Cookie Consent Banner -->
    <transition name="fade">
      <div v-if="showCookieModal" class="cookie-banner">
        <div class="banner-content">
          <p>We use cookies to analyze traffic and personalize content. 
             <router-link to="/cookie-policy" style="color:white; text-decoration:underline;">Read Policy</router-link>
             <span @click="showSettings = !showSettings" class="settings-toggle">
               {{ showSettings ? 'Hide Settings' : 'Manage Settings' }}
             </span>
          </p>
          
          <div v-if="showSettings" class="settings-panel">
            <label><input type="checkbox" v-model="cookiePrefs.necessary" disabled> Strictly Necessary</label>
            <label><input type="checkbox" v-model="cookiePrefs.analytics"> Analytics</label>
            <label><input type="checkbox" v-model="cookiePrefs.marketing"> Marketing</label>
          </div>

          <div class="cookie-actions">
            <button @click="acceptCookies" class="btn-cookie accept">Accept All</button>
            <button v-if="showSettings" @click="saveSettings" class="btn-cookie save">Save Preferences</button>
            <button v-else @click="denyCookies" class="btn-cookie deny">Deny</button>
          </div>
        </div>
      </div>
    </transition>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  background: #111;
  color: #a0a0a0;
  padding: 80px 0 40px;
  border-top: 2px solid var(--color-accent);
}
.footer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-bottom: 40px;
}
.brand h3 { color: var(--color-accent); margin-bottom: 10px; font-family: var(--font-serif); }
h4 { color: white; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.9rem; }
ul { list-style: none; }
li a { color: #a0a0a0; text-decoration: none; transition: 0.3s; }
li a:hover { color: var(--color-accent); }
.copyright { text-align: center; font-size: 0.7rem; border-top: 1px solid #333; padding-top: 20px; }

/* Cookie Banner Styling */
.cookie-banner {
  position: fixed; bottom: 0; left: 0; width: 100%;
  background: #fff; color: #333; padding: 8px 40px;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
}
.banner-content { display: flex; flex-direction: row; gap: 30px; align-items: center; justify-content: center; }
.settings-toggle { color: var(--color-accent); cursor: pointer; text-decoration: underline; font-weight: bold; }
.settings-panel { display: flex; gap: 20px; font-size: 0.8rem; }
.cookie-actions { display: flex; gap: 10px; }
.btn-cookie { border: none; padding: 6px 16px; border-radius: 4px; cursor: pointer; font-size: 0.85rem; }
.btn-cookie.accept { background: var(--color-accent); color: white; }
.btn-cookie.save { background: #333; color: white; }
.btn-cookie.deny { background: #eee; color: #333; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
