<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isLoggedIn = ref(false)
const password = ref('')
const promotions = ref<any[]>([])
const description = ref('')
const selectedFile = ref<File | null>(null)
const editingId = ref<number | null>(null)
const message = ref('')
const showForm = ref(false)
const API_URL = 'http://localhost:3001'

const fetchPromotions = async () => {
  try {
    const res = await fetch(`${API_URL}/api/admin/promotions`)
    promotions.value = await res.json()
  } catch (err) {
    console.error('Fetch error', err)
  }
}

const handleLogin = async () => {
  try {
    const res = await fetch(`${API_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value })
    })
    const data = await res.json()
    if (data.success) {
      isLoggedIn.value = true
      message.value = ''
      fetchPromotions()
    } else {
      message.value = 'Invalid Password'
    }
  } catch (err) {
    message.value = 'Connection error'
  }
}

const onFileChange = (e: any) => {
  selectedFile.value = e.target.files[0]
}

const resetForm = () => {
  description.value = ''
  selectedFile.value = null
  editingId.value = null
  showForm.value = false
  message.value = ''
}

const openCreateForm = () => {
  resetForm()
  showForm.value = true
}

const openEditForm = (promo: any) => {
  description.value = promo.description
  editingId.value = promo.id
  showForm.value = true
  message.value = ''
}

const handleSave = async () => {
  const formData = new FormData()
  formData.append('password', password.value)
  formData.append('description', description.value)
  if (selectedFile.value) {
    formData.append('image', selectedFile.value)
  }

  const url = editingId.value 
    ? `${API_URL}/api/admin/promotions/${editingId.value}`
    : `${API_URL}/api/admin/promotions`
  
  const method = editingId.value ? 'PUT' : 'POST'

  try {
    const res = await fetch(url, { method, body: formData })
    const data = await res.json()
    if (data.success) {
      message.value = editingId.value ? 'Updated!' : 'Created!'
      fetchPromotions()
      setTimeout(resetForm, 1000)
    } else {
      message.value = 'Error saving'
    }
  } catch (err) {
    message.value = 'Save error'
  }
}

const handleDelete = async (id: number) => {
  if (!confirm('Are you sure you want to delete this promotion?')) return

  try {
    const res = await fetch(`${API_URL}/api/admin/promotions/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value })
    })
    const data = await res.json()
    if (data.success) {
      fetchPromotions()
      message.value = 'Deleted successfully'
    }
  } catch (err) {
    message.value = 'Delete error'
  }
}
</script>

<template>
  <div class="admin-panel-overlay">
    <div class="admin-container" :class="{ 'wide': isLoggedIn && !showForm }">
      <!-- Login Section -->
      <div v-if="!isLoggedIn" class="login-box">
        <h2>Admin Access</h2>
        <input v-model="password" type="password" placeholder="Password (1234)" @keyup.enter="handleLogin" />
        <button class="btn-luxury" @click="handleLogin">Login</button>
        <p v-if="message" class="error">{{ message }}</p>
        <button class="btn-close-minimal" @click="$emit('close')">Cancel</button>
      </div>

      <!-- Dashboard Section -->
      <div v-else-if="!showForm" class="dashboard">
        <div class="dash-header">
          <div>
            <h2>Promotions ({{ promotions.length }})</h2>
            <p class="count-badge">Total entries: {{ promotions.length }}</p>
          </div>
          <button class="btn-luxury small" @click="openCreateForm">+ New Promo</button>
        </div>

        <div class="promo-list">
          <div v-for="promo in promotions" :key="promo.id" class="promo-item">
            <div class="item-img">
              <img v-if="promo.image_url" :src="`${API_URL}${promo.image_url}`" />
              <div v-else class="img-placeholder">NO IMG</div>
            </div>
            <div class="item-info">
              <p class="item-desc">{{ promo.description }}</p>
              <span class="item-date">{{ new Date(promo.created_at).toLocaleDateString() }}</span>
            </div>
            <div class="item-actions">
              <button class="btn-edit" @click="openEditForm(promo)">Edit</button>
              <button class="btn-delete" @click="handleDelete(promo.id)">Delete</button>
            </div>
          </div>
          <p v-if="promotions.length === 0" class="empty-msg">No promotions found.</p>
        </div>
        
        <button class="btn-secondary" @click="$emit('close')">Close Admin</button>
      </div>

      <!-- Form Section -->
      <div v-else class="upload-box">
        <h2>{{ editingId ? 'Edit' : 'New' }} Promotion</h2>
        <div class="form-group">
          <label>Image</label>
          <input type="file" @change="onFileChange" accept="image/*" />
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea v-model="description" placeholder="Promotion details..."></textarea>
        </div>
        <div class="form-actions">
          <button class="btn-luxury" @click="handleSave">Save Promotion</button>
          <button class="btn-secondary" @click="resetForm">Back to List</button>
        </div>
        <p v-if="message" class="status">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-panel-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  backdrop-filter: blur(5px);
}

.admin-container {
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  width: 100%;
  max-width: 450px;
  color: #111;
  transition: max-width 0.4s ease;
}

.admin-container.wide {
  max-width: 800px;
}

h2 { font-family: var(--font-serif); margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.1em; }

.count-badge { font-size: 0.8rem; color: #666; margin-top: -15px; margin-bottom: 20px; }

/* Dashboard Styling */
.dash-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }

.promo-list {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 30px;
  border: 1px solid #eee;
}

.promo-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
  gap: 20px;
}

.item-img { width: 60px; height: 60px; background: #f5f5f5; border-radius: 4px; overflow: hidden; flex-shrink: 0; }
.item-img img { width: 100%; height: 100%; object-fit: cover; }
.img-placeholder { font-size: 0.6rem; height: 100%; display: flex; align-items: center; justify-content: center; color: #999; }

.item-info { flex: 1; }
.item-desc { font-size: 0.9rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.item-date { font-size: 0.7rem; color: #888; }

.item-actions { display: flex; gap: 10px; }
.item-actions button { border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.75rem; font-weight: 600; }
.btn-edit { background: #e3f2fd; color: #1976d2; }
.btn-delete { background: #ffebee; color: #c62828; }

/* Form Elements */
input[type="password"], textarea {
  width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ddd; font-family: inherit;
}
textarea { height: 100px; resize: none; }

.btn-luxury.small { padding: 10px 20px; font-size: 0.75rem; }
.btn-secondary { width: 100%; background: #f5f5f5; border: none; padding: 14px; cursor: pointer; color: #666; font-weight: 600; }
.btn-close-minimal { background: none; border: none; color: #888; cursor: pointer; width: 100%; margin-top: 10px; font-size: 0.8rem; }

.error { color: #d32f2f; text-align: center; font-size: 0.85rem; }
.status { color: #2e7d32; text-align: center; font-size: 0.85rem; }
.empty-msg { padding: 40px; text-align: center; color: #999; font-style: italic; }

.form-group label { display: block; margin-bottom: 5px; font-size: 0.8rem; font-weight: 700; color: #555; }
.form-actions { display: flex; flex-direction: column; gap: 10px; }
</style>
