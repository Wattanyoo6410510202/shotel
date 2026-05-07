<script setup lang="ts">
import { ref, inject, type Ref, onMounted } from 'vue'
import type { messages } from '../i18n'

const lang = inject('lang') as Ref<string>
const msgs = inject('messages') as typeof messages

const images = [
  '/asset%20shotel/352193306_125361790568771_4213253714114656861_n.jpg',
  '/asset%20shotel/491840673_1207274931411907_951599178444889184_n.jpg'
]
const currentIndex = ref(0)
const next = () => { currentIndex.value = (currentIndex.value + 1) % images.length }
onMounted(() => setInterval(next, 7000))
</script>

<template>
  <section class="hero">
    <div v-for="(img, i) in images" :key="i" class="slide" :class="{ active: i === currentIndex }"
      :style="{ backgroundImage: `url(${img})` }">
      <div class="overlay"></div>
      <div class="hero-content container">
        <h1 class="hero-title">{{ msgs[lang as keyof typeof msgs].hero.title }}</h1>
        <p class="hero-subtitle">{{ msgs[lang as keyof typeof msgs].sections.spaDesc }}</p>
        <button class="btn-luxury">{{ msgs[lang as keyof typeof msgs].hero.cta }}</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.slide.active {
  opacity: 1;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
}

.hero-content {
  text-align: center;
  color: white;
  z-index: 1;
  padding-bottom: 80px;
  animation: none !important;
}

.hero-title {
  font-size: 2.5rem;
  color: white;
  margin-bottom: 15px;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  animation: none !important;
}

.hero-subtitle {
  font-size: 1.3rem;
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 300;
  opacity: 0.95;
  margin-bottom: 40px;
  letter-spacing: 0.05em;
  line-height: 1.8;
  animation: none !important;
}

.btn-luxury {
  border-color: white;
  color: white;
  background: transparent;
  padding: 14px 40px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.4s ease;
  cursor: pointer;
  animation: none !important;
}

.btn-luxury:hover {
  background: white;
  color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
</style>
