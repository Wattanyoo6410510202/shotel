<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'
import { messages } from './i18n'
import Header from './components/Header.vue'
import Hero from './components/Hero.vue'
import ContentSections from './components/ContentSections.vue'
import Footer from './components/Footer.vue'

const lang = ref('EN')
provide('lang', lang)
provide('messages', messages)

onMounted(() => {
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
  </div>
</template>
