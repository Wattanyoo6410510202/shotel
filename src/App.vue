<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'
import { messages } from './i18n'
import Header from './components/Header.vue'
import Hero from './components/Hero.vue'
import ContentSections from './components/ContentSections.vue'
import Footer from './components/Footer.vue'
import PromotionModal from './components/PromotionModal.vue'
import AdminPanel from './components/AdminPanel.vue'

const lang = ref('EN')
const showAdmin = ref(false)
provide('lang', lang)
provide('messages', messages)

onMounted(() => {
  // Check for admin mode in URL
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.has('admin')) {
    showAdmin.value = true
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('.fade-in-on-scroll').forEach(el => observer.observe(el))
})
</script>

<template>
  <div>
    <Header />
    <Hero />
    <ContentSections />
    <Footer />
    
    <!-- Promotion System -->
    <PromotionModal />
    <AdminPanel v-if="showAdmin" @close="showAdmin = false" />
  </div>
</template>

