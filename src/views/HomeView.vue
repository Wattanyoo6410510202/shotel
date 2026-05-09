<script setup lang="ts">
import { onMounted } from 'vue'
import Header from '../components/Header.vue'
import Hero from '../components/Hero.vue'
import ContentSections from '../components/ContentSections.vue'
import Footer from '../components/Footer.vue'
import PromotionModal from '../components/PromotionModal.vue'

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
    
    <!-- Promotion System -->
    <PromotionModal />
  </div>
</template>
