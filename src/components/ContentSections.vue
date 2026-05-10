<script setup lang="ts">
import { inject, type Ref, ref, computed, onMounted, onUnmounted } from 'vue'
import type { messages } from '../i18n'

const lang = inject('lang') as Ref<keyof typeof messages>
const msgs = inject('messages') as typeof messages

const activeIndex = ref(0)
const activeRoomTab = ref<'rooms' | 'suites'>('rooms')

const categoryStates = ref<Record<string, boolean>>({
  shrines: false,
  shopping: false,
  activities: false
})

const t = computed(() => msgs[lang.value])

const nearbyCategories = computed(() => {
  const locInfo = t.value.sections.locationInfo
  return [
    {
      id: 'shrines',
      title: locInfo.categories.shrines.title,
      color: '#002855',
      isOpen: categoryStates.value.shrines,
      items: locInfo.categories.shrines.items
    },
    {
      id: 'shopping',
      title: locInfo.categories.shopping.title,
      color: '#8e8e8e',
      isOpen: categoryStates.value.shopping,
      items: locInfo.categories.shopping.items
    },
    {
      id: 'activities',
      title: locInfo.categories.activities.title,
      color: '#a366ff',
      isOpen: categoryStates.value.activities,
      items: locInfo.categories.activities.items
    }
  ]
})

const toggleCategory = (id: string) => {
  categoryStates.value[id] = !categoryStates.value[id]
}

const currentRoom = computed(() => {
  const data = (t.value.sections as any).roomData[activeRoomTab.value]
  return {
    ...data,
    image: activeRoomTab.value === 'rooms' 
      ? 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80'
      : 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80'
  }
})

const reviews = computed(() => (t.value.sections as any).reviewList)

const displayPercent = ref(0)
onMounted(() => {
  let start: number | null = null
  const duration = 2000
  const step = (timestamp: number) => {
    if (!start) start = timestamp
    const progress = Math.min((timestamp - start) / duration, 1)
    displayPercent.value = Math.floor(progress * 85)
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
})

let interval: any = null
onMounted(() => {
  interval = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % reviews.value.length
  }, 4000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<template>
  <section id="highlights" class="section container">
    <h2 class="section-title fade-in-on-scroll">{{ t.sections.highlights }}</h2>
    <div class="highlights-grid">
      <div class="highlight-item fade-in-on-scroll" style="transition-delay: 0.2s">
        <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80" alt="Spa"
          class="hl-img">
        <div class="hl-content-slide">
          <h3>{{ t.sections.spa }}</h3>
          <p>{{ t.sections.spaDesc }}</p>
        </div>
      </div>
      <div class="highlight-item fade-in-on-scroll" style="transition-delay: 0.4s">
        <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80"
          alt="Dining" class="hl-img">
        <div class="hl-content-slide">
          <h3>{{ t.sections.dining }}</h3>
          <p>{{ t.sections.diningDesc }}</p>
        </div>
      </div>
      <div class="highlight-item fade-in-on-scroll" style="transition-delay: 0.6s">
        <img src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80"
          alt="Pool" class="hl-img">
        <div class="hl-content-slide">
          <h3>{{ t.sections.pool }}</h3>
          <p>{{ t.sections.poolDesc }}</p>
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
            {{ lang === 'EN' ? 'Rooms' : 'ห้องพัก' }}
          </button>
          <button
            class="room-tab"
            :class="{ active: activeRoomTab === 'suites' }"
            @click="activeRoomTab = 'suites'"
          >
            {{ lang === 'EN' ? 'Suites' : 'สวีท' }}
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
            <button class="btn-luxury secondary">{{ lang === 'EN' ? 'View all accommodation' : 'ดูห้องพักทั้งหมด' }}</button>
          </div>
        </transition>
      </div>
    </div>
  </section>

  <section id="testimonial-hero" class="section testimonial-hero">
    <div class="testimonial-overlay"></div>
    <div class="testimonial-inner container fade-in-on-scroll">
      <div class="testimonial-controls">
        <button class="testimonial-arrow left" aria-label="Previous testimonial" @click="activeIndex = (activeIndex - 1 + reviews.length) % reviews.length"></button>
        <button class="testimonial-arrow right" aria-label="Next testimonial" @click="activeIndex = (activeIndex + 1) % reviews.length"></button>
      </div>
      <div class="testimonial-content">
        <span class="testimonial-kicker">{{ (t.sections as any).testimonial.kicker }}</span>
        <p>“{{ (t.sections as any).testimonial.text }}”</p>
        <span class="testimonial-name">— {{ (t.sections as any).testimonial.author }}</span>
      </div>
      <div class="testimonial-indicators">
        <span v-for="(_, i) in reviews" :key="i" class="indicator" :class="{ active: activeIndex === i }"></span>
      </div>
    </div>
  </section>

  <section id="gallery" class="section">
    <div class="container">
      <h2 class="section-title fade-in-on-scroll">{{ t.sections.gallery }}</h2>
      <div class="gallery-grid">
        <img v-for="i in 9" :key="i"
          :src="`https://images.unsplash.com/photo-${['1566073771259-6a8506099945', '1582719478250-c89cae4dc85b', '1571896349842-33c89424de2d', '1611892440504-42a792e24021', '1631049307264-da0ec9d70304', '1591088398332-8a7791972843', '1522771739844-6a9f6d7f1478', '1618773928121-c32242e47265', '1502672260266-1c1ef2d93688'][i - 1] || '1566073771259-6a8506099945'}?auto=format&fit=crop&w=800&q=80`"
          alt="Gallery Image" class="fade-in-on-scroll" :style="{ 'transition-delay': `${i * 0.1}s` }">
      </div>
    </div>
  </section>

  <section id="reviews" class="section guest-reviews-clean-section">
    <div class="container reviews-inner-clean">
      <div class="reviews-grid-clean">
        <!-- Left Column: Metrics -->
        <div class="metrics-column-clean fade-in-on-scroll">
          <div class="recommendation-box-clean">
            <span class="percent-val-clean">{{ displayPercent }}%</span>
            <p class="recommend-text-clean">{{ lang === 'EN' ? 'of our guests would recommend this hotel' : 'ของแขกที่เข้าพักแนะนำโรงแรมนี้' }}</p>
          </div>
          <div class="metrics-divider-clean"></div>
          <div class="category-ratings-clean">
            <div class="rating-item-exact">
              <div class="stars-bubbles-clean">
                <span class="bubble-filled-clean">●●●●</span><span class="bubble-half-clean">◐</span>
              </div>
              <span class="rating-label-clean">{{ lang === 'EN' ? 'SERVICE' : 'การบริการ' }}</span>
            </div>
            <div class="rating-item-exact">
              <div class="stars-bubbles-clean">
                <span class="bubble-filled-clean">●●●●</span><span class="bubble-half-clean">◐</span>
              </div>
              <span class="rating-label-clean">{{ lang === 'EN' ? 'CLEANLINESS' : 'ความสะอาด' }}</span>
            </div>
            <div class="rating-item-exact">
              <div class="stars-bubbles-clean">
                <span class="bubble-filled-clean">●●●●</span><span class="bubble-half-clean">◐</span>
              </div>
              <span class="rating-label-clean">{{ lang === 'EN' ? 'LOCATION' : 'ทำเลที่ตั้ง' }}</span>
            </div>
            <div class="rating-item-exact">
              <div class="stars-bubbles-clean">
                <span class="bubble-filled-clean">●●●●</span><span class="bubble-half-clean">◐</span>
              </div>
              <span class="rating-label-clean">{{ lang === 'EN' ? 'VALUE' : 'ความคุ้มค่า' }}</span>
            </div>
          </div>
        </div>

        <!-- Right Column: Carousel -->
        <div class="carousel-column-clean fade-in-on-scroll" style="transition-delay: 0.2s">
          <span class="in-their-words-clean">{{ lang === 'EN' ? 'IN THEIR WORDS' : 'จากใจแขกของเรา' }}</span>
          <div class="reviews-carousel-clean">
            <transition-group name="fade-review" tag="div" class="carousel-inner-clean">
              <div v-for="(review, index) in reviews" :key="index" v-show="activeIndex === index" class="review-slide-clean">
                <p class="review-text-clean">"{{ review.text }}"</p>
                <div class="review-divider-clean"></div>
                <div class="reviewer-meta-clean">
                  <h4 class="reviewer-name-clean">{{ review.name }}</h4>
                  <p class="reviewer-location-clean">{{ review.location }}</p>
                  <div class="tripadvisor-logo-clean">
                    <img src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg" alt="Tripadvisor" class="ta-img-clean">
                  </div>
                </div>
              </div>
            </transition-group>
          </div>
        </div>
      </div>

      <!-- Navigation Arrows -->
      <div class="reviews-nav-clean">
        <button @click="activeIndex = (activeIndex - 1 + reviews.length) % reviews.length" class="nav-arrow-clean prev" aria-label="Previous"></button>
        <button @click="activeIndex = (activeIndex + 1) % reviews.length" class="nav-arrow-clean next" aria-label="Next"></button>
      </div>
    </div>
  </section>

  <section id="location" class="section">
    <div class="container">
      <div class="location-layout">
        <div class="map-column fade-in-on-scroll">
          <div class="map-wrapper">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.58123797436!2d100.5378241758652!3d13.741014797475!2m3!1f0!2f0!3f0!3m2!1i102!2i768!4f13.1!3m3!1m2!1s0x30e29ed899889417%3A0x6b2e3e527c768000!2sAnantara%20Siam%20Bangkok%20Hotel!5e0!3m2!1sen!2sth!4v1715400000000!5m2!1sen!2sth"
              width="100%" height="100%" style="border:0;" loading="lazy"></iframe>
          </div>
        </div>
        
        <div class="info-column fade-in-on-scroll" style="transition-delay: 0.2s">
          <div class="hotel-info">
            <h2 class="hotel-title">{{ t.sections.locationInfo.hotelName }}</h2>
            
            <div class="contact-details">
              <div class="contact-item">
                <span class="icon-svg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </span>
                <a href="tel:+6621268866">+66 2 126 8866</a>
              </div>
              <div class="contact-item">
                <span class="icon-svg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </span>
                <a href="mailto:siam@anantara.com">siam@anantara.com</a>
              </div>
              <div class="contact-item">
                <span class="icon-svg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </span>
                <span>{{ t.sections.locationInfo.address }}</span>
              </div>
              <div class="gps-details">
                <p>{{ t.sections.locationInfo.gps }}</p>
                <a href="https://maps.google.com/?q=13.7410148,100.5400074" target="_blank" class="map-link">{{ t.sections.locationInfo.openMap }}</a>
              </div>
            </div>

            <div class="explore-section">
              <h3 class="explore-title">{{ t.sections.locationInfo.exploreNearby }}</h3>
              <div class="explore-categories">
                <div v-for="cat in nearbyCategories" :key="cat.id" class="explore-cat">
                  <div class="cat-header" @click="toggleCategory(cat.id)">
                    <div class="cat-main">
                      <span class="cat-pin">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" :fill="cat.color" stroke="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path></svg>
                      </span>
                      <span class="cat-label">{{ cat.title }}</span>
                    </div>
                    <span class="cat-arrow" :class="{ 'is-open': cat.isOpen }">▼</span>
                  </div>
                  <transition name="expand">
                    <div v-if="cat.isOpen" class="cat-content">
                      <ul>
                        <li v-for="item in cat.items" :key="item">{{ item }}</li>
                      </ul>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

/* Guest Reviews Section (Ultra Compact Clean Layout) */
.guest-reviews-clean-section {
  padding: 30px 0;
  background-color: #fff;
  color: #333;
}

.reviews-inner-clean {
  max-width: 1100px;
}

.reviews-grid-clean {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 60px;
  align-items: center;
}

/* Left Column: Metrics */
.metrics-column-clean {
  text-align: left;
}

.percent-val-clean {
  display: block;
  font-family: var(--font-serif);
  font-size: 3.8rem;
  line-height: 1;
  font-weight: 300;
  color: #888;
  margin-bottom: 10px;
}

.recommend-text-clean {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.4;
  max-width: 160px;
}

.metrics-divider-clean {
  width: 40px;
  height: 1px;
  background: #eee;
  margin: 15px 0;
}

.category-ratings-clean {
  display: grid;
  gap: 12px;
}

.rating-item-exact {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stars-bubbles-clean {
  font-size: 0.9rem;
  letter-spacing: 2px;
  color: #aaa;
}

.bubble-filled-clean { color: #888; }
.bubble-half-clean { color: #888; }

.rating-label-clean {
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  color: #666;
  font-weight: 600;
}

/* Right Column: Carousel */
.in-their-words-clean {
  display: block;
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  color: #bbb;
  margin-bottom: 15px;
  text-align: center;
  text-transform: uppercase;
}

.carousel-inner-clean {
  position: relative;
  min-height: 180px;
}

.review-slide-clean {
  width: 100%;
}

.review-text-clean {
  font-size: 1.05rem;
  line-height: 1.6;
  color: #444;
  font-weight: 300;
  margin-bottom: 20px;
}

.review-divider-clean {
  width: 40px;
  height: 1px;
  background: #ddd;
  margin-bottom: 20px;
}

.reviewer-name-clean {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  margin-bottom: 4px;
  text-transform: uppercase;
  font-weight: 600;
  color: #333;
}

.reviewer-location-clean {
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  color: #999;
  margin-bottom: 15px;
  text-transform: uppercase;
}

.ta-img-clean {
  height: 18px;
  filter: grayscale(1) opacity(0.4);
}

/* Navigation Arrows */
.reviews-nav-clean {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.nav-arrow-clean {
  width: 30px;
  height: 30px;
  background: transparent;
  border: none;
  cursor: pointer;
  position: relative;
  transition: opacity 0.3s ease;
}

.nav-arrow-clean:hover {
  opacity: 0.5;
}

.nav-arrow-clean::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-style: solid;
}

.nav-arrow-clean.prev::after {
  border-width: 8px 11px 8px 0;
  border-color: transparent #ddd transparent transparent;
  transform: translate(-50%, -50%);
}

.nav-arrow-clean.next::after {
  border-width: 8px 0 8px 11px;
  border-color: transparent transparent transparent #ddd;
  transform: translate(-50%, -50%);
}

@media (max-width: 1024px) {
  .reviews-grid-clean { grid-template-columns: 1fr; gap: 30px; }
  .metrics-column-clean { text-align: center; }
  .metrics-divider-clean { margin: 15px auto; }
  .category-ratings-clean { justify-content: center; }
  .review-text-clean { text-align: center; font-size: 1rem; }
  .review-divider-clean { margin: 0 auto 20px; }
  .reviews-nav-clean { justify-content: center; gap: 40px; }
  .reviewer-meta-clean { text-align: center; }
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

.location-layout {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 48px;
  align-items: start;
}

.map-wrapper {
  height: 600px;
  border-radius: 24px;
  overflow: hidden;
}

.hotel-title {
  font-family: var(--font-serif);
  font-size: 2.4rem;
  margin-bottom: 32px;
  color: #888;
  font-weight: 300;
  line-height: 1.1;
}

.contact-details {
  margin-bottom: 48px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
  color: #666;
  font-family: var(--font-sans);
  font-size: 1rem;
}

.contact-item a, .map-link {
  text-decoration: underline;
  text-underline-offset: 4px;
  color: var(--color-accent);
  transition: opacity 0.3s ease;
}

.gps-details {
  margin-top: 24px;
  color: #888;
  font-family: var(--font-sans);
  font-size: 1rem;
  letter-spacing: 0.02em;
}

.explore-title {
  font-family: var(--font-sans);
  font-size: 0.85rem;
  letter-spacing: 0.2em;
  color: #666;
  margin-bottom: 24px;
  font-weight: 600;
  text-transform: uppercase;
}

.explore-cat { border-bottom: 1px solid #eee; }
.cat-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; cursor: pointer; }
.cat-main { display: flex; align-items: center; gap: 16px; }
.cat-pin { display: flex; align-items: center; }
.icon-svg { display: flex; align-items: center; justify-content: center; color: #666; }
.cat-label { font-family: var(--font-sans); font-size: 1.1rem; letter-spacing: 0.05em; color: #333; font-weight: 500; }
.cat-arrow { font-size: 0.7rem; transition: transform 0.3s ease; color: #999; }
.cat-arrow.is-open { transform: rotate(180deg); }
.cat-content { padding-bottom: 16px; }
.cat-content ul { list-style: none; padding-left: 32px; }
.cat-content li { margin-bottom: 8px; color: #666; font-family: var(--font-sans); font-size: 0.95rem; }

@media (max-width: 1024px) {
  .room-panel { grid-template-columns: 1fr; }
  .room-content-panel { padding: 32px; }
}

@media (max-width: 768px) {
  .rooms-header { gap: 14px; }
  .rooms-tabs { width: 100%; }
  .room-panel { gap: 22px; }
  .room-content-panel { padding: 28px; }
  .room-content-panel h3 { font-size: 1.8rem; }
  .section { padding: 50px 0; }
  .section-title { font-size: 1.95rem; margin-bottom: 32px; }
  .highlights-grid, .gallery-grid { grid-template-columns: 1fr; }
  .highlight-item { height: 320px; }
  .hl-content-slide { padding: 24px; }
  .gallery-grid img { height: 220px; }
}

@media (max-width: 540px) {
  .section { padding: 36px 0; }
  .section-title { font-size: 1.6rem; margin-bottom: 24px; }
  .room-tab { padding: 10px 16px; font-size: 0.75rem; }
  .room-panel { gap: 20px; }
  .room-content-panel { padding: 24px; }
  .room-content-panel h3 { font-size: 1.6rem; }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.45s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.expand-enter-active, .expand-leave-active { transition: all 0.3s ease; max-height: 200px; overflow: hidden; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; }
</style>