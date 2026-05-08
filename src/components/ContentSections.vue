<script setup lang="ts">
import { inject, type Ref, ref, computed, onMounted } from 'vue'
import type { messages } from '../i18n'

const lang = inject('lang') as Ref<string>
const msgs = inject('messages') as typeof messages

const activeIndex = ref(0)
const activeRoomTab = ref<'rooms' | 'suites'>('rooms')

const roomData = {
  rooms: {
    title: 'Rooms',
    description: 'Discover spacious, light-filled rooms designed for true relaxation with handcrafted details and modern comforts.',
    features: [
      '42 sqm',
      'Garden, cityscape, pool or golf course views',
      'Marble bathroom with separate tub and rain shower',
    ],
    image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
  },
  suites: {
    title: 'Suites',
    description: 'Elevate your stay in our exclusive suites with private lounge areas, premium finishes and luxurious amenities.',
    features: [
      '75 sqm',
      'Generous living area with panoramic windows',
      'Private balcony and premium service',
    ],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
  },
}

const currentRoom = computed(() => roomData[activeRoomTab.value])

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
      <div class="rooms-header fade-in-on-scroll">
        <span class="rooms-pretitle">ACCOMMODATION</span>
        <h2 class="section-title">Choose your sanctuary</h2>
        <div class="rooms-tabs">
          <button
            class="room-tab"
            :class="{ active: activeRoomTab === 'rooms' }"
            @click="activeRoomTab = 'rooms'"
          >
            Rooms
          </button>
          <button
            class="room-tab"
            :class="{ active: activeRoomTab === 'suites' }"
            @click="activeRoomTab = 'suites'"
          >
            Suites
          </button>
        </div>
      </div>

      <div class="room-panel fade-in-on-scroll" style="transition-delay: 0.3s">
        <transition name="fade-slide" mode="out-in">
          <div class="room-image-panel" :key="activeRoomTab">
            <img :src="currentRoom.image" :alt="currentRoom.title" />
          </div>
        </transition>

        <transition name="fade-slide" mode="out-in">
          <div class="room-content-panel" :key="activeRoomTab">
            <h3>{{ currentRoom.title }}</h3>
            <p>{{ currentRoom.description }}</p>
            <ul class="room-features">
              <li v-for="(feature, index) in currentRoom.features" :key="index">{{ feature }}</li>
            </ul>
            <button class="btn-luxury secondary">View all accommodation</button>
          </div>
        </transition>
      </div>
    </div>
  </section>

  <section id="testimonial-hero" class="section testimonial-hero">
    <div class="testimonial-overlay"></div>
    <div class="testimonial-inner container fade-in-on-scroll">
      <div class="testimonial-controls">
        <button class="testimonial-arrow left" aria-label="Previous testimonial"></button>
        <button class="testimonial-arrow right" aria-label="Next testimonial"></button>
      </div>
      <div class="testimonial-content">
        <span class="testimonial-kicker">Good Designed Pool Villa</span>
        <p>“I like the how the pool villa is so fancy and delicate. The room is also very neat and tidy. I wish to come here again next time. The staff were really nice and helpful. I would definitely recommend my friends to stay here next time.”</p>
        <span class="testimonial-name">— Hayley P</span>
      </div>
      <div class="testimonial-indicators">
        <span class="indicator active"></span>
        <span class="indicator"></span>
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
  padding: 80px 0;
}

.section-title {
  text-align: center;
  margin-bottom: 48px;
  font-size: 2.4rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.rooms-header {
  display: grid;
  gap: 16px;
  justify-items: center;
  margin-bottom: 40px;
}

.rooms-pretitle {
  font-size: 0.8rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.rooms-tabs {
  display: inline-flex;
  border-radius: 999px;
  background: rgba(19, 19, 19, 0.05);
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.room-tab {
  padding: 14px 28px;
  background: transparent;
  border: none;
  color: var(--color-muted);
  font-size: 0.85rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.25s ease;
}

.room-tab.active {
  background: var(--color-primary);
  color: var(--color-white);
  box-shadow: 0 16px 35px rgba(20, 20, 20, 0.14);
}

.room-panel {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 28px;
  align-items: center;
  transition: all 0.35s ease;
}

.room-image-panel {
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(20, 20, 20, 0.12);
  transition: box-shadow 0.35s ease, transform 0.35s ease;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.45s ease, transform 0.45s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(18px);
}

.room-image-panel img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.room-content-panel {
  padding: 44px;
  background: #f8f4ef;
  border-radius: 28px;
  box-shadow: 0 28px 70px rgba(20, 20, 20, 0.09);
  transition: all 0.35s ease;
}

.room-content-panel h3 {
  margin-bottom: 22px;
  font-size: 2.05rem;
}

.room-content-panel p {
  margin-bottom: 26px;
  color: var(--color-muted);
  line-height: 1.85;
}

.room-features {
  list-style: none;
  padding: 0;
  margin: 0 0 34px;
  display: grid;
  gap: 14px;
}

.room-features li {
  position: relative;
  padding-left: 26px;
  color: var(--color-text);
  line-height: 1.7;
}

.room-features li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.7em;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-accent);
}

.btn-luxury.secondary {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.poolvilla-section {
  padding-top: 100px;
}


.testimonial-hero {
  position: relative;
  min-height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80&sat=-10&exp=15');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  overflow: hidden;
}

.testimonial-overlay {
  position: absolute;
  inset: 0;
  background: rgba(17, 17, 17, 0.55);
}

.testimonial-inner {
  position: relative;
  z-index: 1;
  text-align: center;
  color: #ffffff;
  max-width: 720px;
  margin: 0 auto;
  padding: 120px 24px;
  transition: all 0.35s ease;
}

.testimonial-kicker {
  display: block;
  font-size: 0.85rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20px;
}

.testimonial-content p {
  font-size: clamp(1rem, 1.2vw, 1.2rem);
  line-height: 1.9;
  margin: 0 auto 34px;
  max-width: 680px;
  color: rgba(255, 255, 255, 0.9);
}

.testimonial-name {
  display: block;
  font-size: 0.95rem;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.78);
}

.testimonial-controls {
  position: absolute;
  inset: auto 30px 30px auto;
  z-index: 2;
  display: flex;
  gap: 18px;
}

.testimonial-arrow {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: transform 0.25s ease, background 0.25s ease;
}

.testimonial-arrow:hover {
  transform: scale(1.05);
  background: rgba(255, 255, 255, 0.16);
}

.testimonial-arrow.left::before,
.testimonial-arrow.right::before {
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  width: 10px;
  height: 10px;
  border-top: 2px solid #fff;
  border-right: 2px solid #fff;
  transform: rotate(135deg);
}

.testimonial-arrow.right::before {
  transform: rotate(-45deg);
}

.testimonial-indicators {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
}

.indicator {
  width: 40px;
  height: 4px;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 999px;
}

.indicator.active {
  background: #ffffff;
}

@media (max-width: 1024px) {
  .testimonial-hero {
    background-attachment: scroll;
  }
}

@media (max-width: 1024px) {
  .room-panel {
    grid-template-columns: 1fr;
  }

  .room-content-panel {
    padding: 32px;
  }
}

@media (max-width: 768px) {
  .rooms-header {
    gap: 14px;
  }

  .rooms-tabs {
    width: 100%;
  }

  .room-panel {
    gap: 22px;
  }

  .room-content-panel {
    padding: 28px;
  }

  .room-content-panel h3 {
    font-size: 1.8rem;
  }
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.highlight-item {
  position: relative;
  overflow: hidden;
  height: 420px;
  border-radius: 28px;
  box-shadow: 0 24px 70px rgba(23, 23, 23, 0.12);
}

.hl-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease, filter 0.7s ease;
}

.hl-content-slide {
  position: absolute;
  top: 0;
  right: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(16, 16, 16, 0.78) 58%);
  color: #f7f4ee;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 36px;
  transition: right 0.55s ease;
  text-align: center;
}

.highlight-item:hover .hl-content-slide {
  right: 0;
}

.highlight-item:hover .hl-img {
  transform: scale(1.08);
  filter: brightness(0.45);
}

.hl-content-slide h3 {
  font-family: var(--font-serif);
  font-size: 1.55rem;
  margin-bottom: 18px;
  color: var(--color-accent);
}

.hl-content-slide p {
  color: rgba(255, 255, 255, 0.92);
  font-size: 1rem;
  line-height: 1.8;
  max-width: 36rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.gallery-grid img {
  width: 100%;
  height: 270px;
  object-fit: cover;
  filter: grayscale(25%);
  transition: transform 0.5s ease, filter 0.5s ease, box-shadow 0.5s ease;
  border-radius: 20px;
  box-shadow: 0 14px 30px rgba(20, 20, 20, 0.08);
}

.gallery-grid img:hover {
  filter: grayscale(0%);
  transform: translateY(-6px) scale(1.03);
  box-shadow: 0 22px 50px rgba(20, 20, 20, 0.18);
}

.section-full {
  padding: 100px 0 0;
  overflow: hidden;
  position: relative;
  width: 100vw;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.map-container-full {
  width: 100%;
  max-width: 100%;
  min-height: 70vh;
  height: 70vh;
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 30px 70px rgba(18, 18, 18, 0.14);
  position: relative;
}

.map-container-full iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

.rooms-layered-layout {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  max-width: 1100px;
  margin: 48px auto 0;
  gap: 28px;
  align-items: center;
}

.room-img-container {
  position: relative;
  min-height: 500px;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 30px 70px rgba(18, 18, 18, 0.12);
}

.room-img-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.room-text-container {
  background: linear-gradient(180deg, #1a1a1a 0%, #262626 100%);
  color: #f7f4ee;
  padding: 48px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.room-text-container h3 {
  font-size: 2.1rem;
  margin-bottom: 0;
}

.room-text-container p {
  line-height: 1.9;
  opacity: 0.94;
  max-width: 36rem;
}

.rooms-reverse {
  direction: rtl;
}

.rooms-reverse .room-text-container {
  direction: ltr;
}

.reviews-wrapper {
  display: grid;
  grid-template-columns: 1.55fr 0.75fr;
  gap: 32px;
  align-items: center;
  padding: 36px 0 0;
}

.reviews-carousel {
  position: relative;
  min-height: 230px;
}

.carousel-inner {
  position: relative;
  min-height: 230px;
}

.review-card {
  position: absolute;
  inset: 0;
  padding: 34px;
  border-left: 4px solid var(--color-accent);
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 24px 60px rgba(20, 20, 20, 0.08);
}

.stars {
  color: var(--color-accent);
  margin-bottom: 18px;
  font-size: 1.3rem;
}

.review-text {
  color: #202020;
  font-size: 1.03rem;
  line-height: 1.9;
  margin-bottom: 22px;
  font-style: italic;
}

.review-name {
  color: #2b2b2b;
  font-weight: 700;
  font-size: 1rem;
}

.award-img {
  display: flex;
  justify-content: center;
  align-items: center;
}

.award-img img {
  max-width: 85%;
  height: auto;
  border-radius: 24px;
  box-shadow: 0 24px 60px rgba(20, 20, 20, 0.12);
}

@media (max-width: 1024px) {
  .rooms-layered-layout,
  .reviews-wrapper {
    grid-template-columns: 1fr;
  }

  .room-text-container {
    padding: 36px;
  }
}

@media (max-width: 768px) {
  .section {
    padding: 50px 0;
  }

  .section-title {
    font-size: 1.95rem;
    margin-bottom: 32px;
  }

  .highlights-grid,
  .gallery-grid {
    grid-template-columns: 1fr;
  }

  .highlight-item {
    height: 320px;
  }

  .hl-content-slide {
    padding: 24px;
  }

  .gallery-grid img {
    height: 220px;
  }

  .rooms-layered-layout {
    display: flex;
    flex-direction: column;
  }

  .room-img-container {
    min-height: 320px;
  }

  .room-text-container {
    margin-top: -60px;
    width: 100%;
    padding: 28px;
  }

  .reviews-wrapper {
    gap: 24px;
  }

  .award-img {
    order: -1;
    width: 100%;
  }

  .award-img img {
    max-width: 100%;
  }

  .map-container-full {
    min-height: 320px;
  }
}

@media (max-width: 540px) {
  .section {
    padding: 36px 0;
  }

  .section-title {
    font-size: 1.6rem;
    margin-bottom: 24px;
  }

  .rooms-tabs {
    max-width: 100%;
  }

  .room-tab {
    padding: 10px 16px;
    font-size: 0.75rem;
  }

  .room-panel {
    gap: 20px;
  }

  .room-content-panel {
    padding: 24px;
  }

  .room-content-panel h3 {
    font-size: 1.6rem;
  }

  .testimonial-hero {
    min-height: 420px;
  }

  .testimonial-inner {
    padding: 80px 18px;
  }

  .testimonial-kicker {
    margin-bottom: 16px;
  }

  .testimonial-content p {
    margin-bottom: 24px;
  }

  .testimonial-controls {
    display: none;
  }

  .testimonial-indicators {
    gap: 10px;
  }

  .highlight-item {
    height: 260px;
  }

  .gallery-grid img {
    height: 180px;
  }

  .map-container-full {
    height: 55vh;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.45s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>