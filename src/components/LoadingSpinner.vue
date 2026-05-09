<script setup lang="ts">
defineProps<{
  message?: string
  fullScreen?: boolean
}>()
</script>

<template>
  <div :class="['loading-container', { 'full-screen': fullScreen }]">
    <div class="loading-content">
      <div class="loading-logo">S</div>
      <div class="loading-bar">
        <div class="bar-progress"></div>
      </div>
      <p v-if="message">{{ message }}</p>
    </div>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: transparent;
}

.loading-container.full-screen {
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 10000;
  height: 100vh;
}

.loading-content {
  text-align: center;
  width: 200px;
}

.loading-logo {
  font-family: var(--font-serif);
  font-size: 3rem;
  color: var(--color-accent);
  margin-bottom: 20px;
  animation: pulse 2s infinite ease-in-out;
}

.loading-bar {
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 15px;
  overflow: hidden;
  position: relative;
}

/* On white backgrounds, adjust bar color */
:not(.full-screen) .loading-bar {
  background: rgba(0, 0, 0, 0.05);
}

.bar-progress {
  width: 50%;
  height: 100%;
  background: var(--color-accent);
  position: absolute;
  animation: loadingMove 1.5s infinite linear;
}

p {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: #888;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.05); }
}

@keyframes loadingMove {
  0% { left: -50%; }
  100% { left: 100%; }
}
</style>
