<script setup lang="ts">
import { inject, type Ref, ref, onMounted } from 'vue'
import type { messages } from '../i18n'

const lang = inject('lang') as Ref<string>
const msgs = inject('messages') as typeof messages

const activeIndex = ref(0)
const reviews = (msgs[lang.value as keyof typeof msgs].sections as any).reviewList
onMounted(() => {
  setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % reviews.length
  }, 4000)
})
</script>

<template>
  <section id="highlights" class="section container">
    <h2 class="section-title fade-in-on-scroll">{{ msgs[lang as keyof typeof msgs].sections.highlights }}</h2>
    <div class="highlights-grid">
      <div class="highlight-item fade-in-on-scroll" style="transition-delay: 0.2s">
        <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80" alt="Spa"
          class="hl-img">
        <div class="hl-content-slide">
          <h3>{{ msgs[lang as keyof typeof msgs].sections.spa }}</h3>
          <p>{{ msgs[lang as keyof typeof msgs].sections.spaDesc }}</p>
        </div>
      </div>
      <div class="highlight-item fade-in-on-scroll" style="transition-delay: 0.4s">
        <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80"
          alt="Dining" class="hl-img">
        <div class="hl-content-slide">
          <h3>{{ msgs[lang as keyof typeof msgs].sections.dining }}</h3>
          <p>{{ msgs[lang as keyof typeof msgs].sections.diningDesc }}</p>
        </div>
      </div>
      <div class="highlight-item fade-in-on-scroll" style="transition-delay: 0.6s">
        <img src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80"
          alt="Pool" class="hl-img">
        <div class="hl-content-slide">
          <h3>{{ msgs[lang as keyof typeof msgs].sections.pool }}</h3>
          <p>{{ msgs[lang as keyof typeof msgs].sections.poolDesc }}</p>
        </div>
      </div>
    </div>
  </section>

  <section id="rooms" class="section">
    <div class="container">
      <h2 class="section-title fade-in-on-scroll">{{ msgs[lang as keyof typeof msgs].sections.rooms }}</h2>

      <div class="rooms-layered-layout fade-in-on-scroll">
        <div class="room-img-container">
          <img src="https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80"
            alt="Deluxe Room">
        </div>
        <div class="room-text-container">
          <h3>{{ msgs[lang as keyof typeof msgs].sections.deluxe }}</h3>
          <p>Experience refined comfort with our premium amenities and city views.</p>
          <button class="btn-luxury">BOOK NOW</button>
        </div>
      </div>

      <div class="rooms-layered-layout rooms-reverse fade-in-on-scroll" style="transition-delay: 0.3s">
        <div class="room-img-container">
          <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80"
            alt="Executive Suite">
        </div>
        <div class="room-text-container">
          <h3>{{ msgs[lang as keyof typeof msgs].sections.suite }}</h3>
          <p>Indulge in spacious elegance with our exclusive executive suite offerings.</p>
          <button class="btn-luxury">BOOK NOW</button>
        </div>
      </div>
    </div>
  </section>

  <section id="gallery" class="section">
    <div class="container">
      <h2 class="section-title fade-in-on-scroll">{{ msgs[lang as keyof typeof msgs].sections.gallery }}</h2>
      <div class="gallery-grid">
        <img v-for="i in 9" :key="i"
          :src="`https://images.unsplash.com/photo-${['1566073771259-6a8506099945', '1582719478250-c89cae4dc85b', '1571896349842-33c89424de2d', '1611892440504-42a792e24021', '1631049307264-da0ec9d70304', '1591088398332-8a7791972843', '1522771739844-6a9f6d7f1478', '1618773928121-c32242e47265', '1502672260266-1c1ef2d93688'][i - 1] || '1566073771259-6a8506099945'}?auto=format&fit=crop&w=800&q=80`"
          alt="Gallery Image" class="fade-in-on-scroll" :style="{ 'transition-delay': `${i * 0.1}s` }">
      </div>
    </div>
  </section>

  <section id="reviews" class="section bg-light">
    <div class="container">
      <h2 class="section-title">{{ msgs[lang as keyof typeof msgs].sections.reviews }}</h2>
      <div class="reviews-wrapper">
        <div class="reviews-carousel">
          <transition-group name="fade" tag="div" class="carousel-inner">
            <div class="review-card" v-for="(review, index) in reviews" :key="index" v-show="activeIndex === index">
              <div class="stars">★★★★★</div>
              <p class="review-text">"{{ review.text }}"</p>
              <p class="review-name">— {{ review.name }}</p>
            </div>
          </transition-group>
        </div>
        <div class="award-img">
          <img src="/asset%20shotel/sukosol-awards.png" alt="Awards">
        </div>
      </div>
    </div>
  </section>

  <section id="location" class="section-full">
    <h2 class="section-title">{{ msgs[lang as keyof typeof msgs].sections.location }}</h2>
    <div class="map-container-full fade-in-on-scroll" style="transition-delay: 0.3s">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126646.2081699042!2d100.3804!3d6.9981!2m3!1f0!2f0!3f0!3m2!1i102!2i768!4f13.1!3m3!1m2!1s0x304d39e8c8b8b8b8%3A0x8b8b8b8b8b8b8b8b!2sHat%20Yai%2C%20Songkhla!5e0!3m2!1sen!2sth!4v1680000000000"
        width="100%" height="500" style="border:0;" loading="lazy"></iframe>
    </div>
  </section>
</template>

<style scoped>
.bg-light {
  background-color: #f8f8f8;
}

.section {
  padding: 60px 0;
}

.section-title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2.2rem;
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.highlight-item {
  position: relative;
  overflow: hidden;
  height: 450px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.hl-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.5s;
}

.hl-content-slide {
  position: absolute;
  top: 0;
  right: -100%;
  width: 100%;
  height: 100%;
  background: rgba(26, 26, 26, 0.92);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  transition: right 0.5s ease-in-out;
  text-align: center;
}

.highlight-item:hover .hl-content-slide {
  right: 0;
}

.highlight-item:hover .hl-img {
  filter: brightness(0.4) blur(2px);
  transform: scale(1.1);
}

.hl-title {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: var(--color-accent);
}

.hl-desc {
  font-size: 1rem;
  line-height: 1.6;
  color: #fff;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.gallery-grid img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  filter: grayscale(25%);
  transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.gallery-grid img:hover {
  filter: grayscale(0%);
  transform: scale(1.08);
  z-index: 2;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

.section-full {
  padding: 80px 0 0;
}

.map-container-full {
  width: 100%;
  height: 500px;
}

.map-container-full iframe {
  display: block;
}

.rooms-layered-layout {
  display: flex;
  position: relative;
  max-width: 1000px;
  margin: 60px auto;
  align-items: center;
}

.room-img-container {
  flex: 1;
  z-index: 1;
  height: 500px;
}

.room-img-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.room-text-container {
  flex: 0 0 500px;
  background: var(--color-primary, #3b1b36);
  color: white;
  padding: 60px;
  margin-left: -100px;
  z-index: 2;
}

.room-text-container h3 {
  font-size: 2rem;
  margin-bottom: 20px;
  font-family: var(--font-serif);
}

.room-text-container p {
  margin-bottom: 30px;
  line-height: 1.8;
  opacity: 0.9;
}

.rooms-reverse {
  flex-direction: row-reverse;
}

.rooms-reverse .room-text-container {
  margin-left: 0;
  margin-right: -100px;
}

@media (max-width: 768px) {
  .rooms-layered-layout {
    flex-direction: column;
  }

  .room-text-container {
    margin-left: 0;
    margin-right: 0;
    margin-top: -50px;
    width: 90%;
  }

  .highlights-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .highlight-item {
    height: 300px;
  }

  .hl-content-slide {
    padding: 20px;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .gallery-grid img {
    height: 200px;
  }

  .reviews-wrapper {
    flex-direction: column;
  }

  .award-img {
    order: -1;
    margin-bottom: 20px;
  }
}

.reviews-wrapper {
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 40px 0;
  width: 100%;
}

.reviews-carousel {
  flex: 2;
  position: relative;
}

.carousel-inner {
  position: relative;
  height: 220px;
}

.review-card {
  position: absolute;
  width: 100%;
  padding: 30px;
  border-left: 4px solid var(--color-accent);
  background: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stars {
  color: var(--color-accent);
  margin-bottom: 15px;
  font-size: 1.2rem;
  letter-spacing: 0.1em;
}

.review-text {
  color: #333;
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 15px;
  font-style: italic;
}

.review-name {
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.95rem;
}

.award-img {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.award-img img {
  max-width: 70%;
  height: auto;
}

.btn-luxury {
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.btn-luxury:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(197, 160, 89, 0.3);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>