<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showModal = ref(false)
const promotion = ref({ image_url: '', description: '' })
const API_URL = 'http://localhost:3001'

onMounted(async () => {
  // Check if user has already seen the promo in this session
  if (sessionStorage.getItem('promo_seen')) {
    return
  }

  try {
    const res = await fetch(`${API_URL}/api/promotion/latest`)
    if (!res.ok) throw new Error('Server response not OK')
    const data = await res.json()
    // Check if data is not empty (latest row found)
    if (data && data.id && (data.image_url || data.description)) {
      promotion.value = data
      showModal.value = true
    }
  } catch (err) {
    console.error('PromotionModal: Failed to fetch', err)
  }
})

const closeModal = () => {
  showModal.value = false
  // Set flag in sessionStorage so it doesn't show again in this session
  sessionStorage.setItem('promo_seen', 'true')
}
</script>

<template>
  <Transition name="fade">
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">&times;</button>
        
        <div class="modal-body">
          <!-- Image Section (Left) -->
          <div class="modal-image-side">
            <img v-if="promotion.image_url" :src="`${API_URL}${promotion.image_url}`" alt="Promotion" />
            <div v-else class="promo-placeholder">S HATYAI</div>
          </div>

          <!-- Text Section (Right) -->
          <div class="modal-text-side">
            <div class="text-content">
              <span class="sub-title">Special Offer</span>
              <h2>{{ promotion.image_url ? 'Limited Promotion' : 'Welcome' }}</h2>
              <div class="divider"></div>
              <p>{{ promotion.description }}</p>
              <button class="btn-luxury" @click="closeModal">Learn More</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>


<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7); /* Darkened but NO BLUR as requested */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-content {
  background: #ffffff;
  max-width: 900px; /* Wider for side-by-side */
  width: 100%;
  position: relative;
  border-radius: 4px; /* Sharper, more professional corners */
  overflow: hidden;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
}

.modal-body {
  display: flex;
  min-height: 450px;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 32px;
  cursor: pointer;
  z-index: 20;
  color: #111;
  line-height: 1;
  transition: transform 0.3s ease;
}

.close-btn:hover {
  transform: rotate(90deg);
}

/* Left Side: Image */
.modal-image-side {
  flex: 1.1; /* Slightly larger image side */
  background: #1a1a1a;
  position: relative;
}

.modal-image-side img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.promo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent);
  font-family: var(--font-serif);
  letter-spacing: 0.5em;
  font-size: 1.2rem;
}

/* Right Side: Text */
.modal-text-side {
  flex: 1;
  padding: 60px 50px;
  display: flex;
  align-items: center;
  background: #fff;
}

.text-content {
  width: 100%;
}

.sub-title {
  display: block;
  text-transform: uppercase;
  color: var(--color-accent);
  font-size: 0.8rem;
  letter-spacing: 0.3em;
  margin-bottom: 12px;
  font-weight: 600;
}

.modal-text-side h2 {
  font-family: var(--font-serif);
  font-size: 2.2rem;
  margin-bottom: 20px;
  color: #111;
  line-height: 1.1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.divider {
  width: 40px;
  height: 2px;
  background: var(--color-accent);
  margin-bottom: 24px;
}

.modal-text-side p {
  color: #444;
  margin-bottom: 40px;
  line-height: 1.8;
  font-size: 1.05rem;
}

.btn-luxury {
  padding: 16px 40px;
  border-radius: 0; /* Match sharp theme */
  font-size: 0.85rem;
  width: auto;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 850px) {
  .modal-body {
    flex-direction: column;
  }
  .modal-image-side {
    height: 250px;
  }
  .modal-text-side {
    padding: 40px 30px;
  }
  .modal-text-side h2 {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .modal-image-side {
    height: 200px;
  }
  .modal-text-side h2 {
    font-size: 1.5rem;
  }
}
</style>

