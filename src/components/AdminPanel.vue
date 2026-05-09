<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import LoadingSpinner from './LoadingSpinner.vue'

const router = useRouter()
const isLoggedIn = ref(false)
const isLoading = ref(true)
const promotions = ref<any[]>([])
const description = ref('')
const endAt = ref('')
const selectedFile = ref<File | null>(null)
const editingId = ref<number | null>(null)
const message = ref('')
const showForm = ref(false)
const API_URL = 'http://localhost:3001'

const checkAdminAccess = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    router.push('/login?redirect=/admin')
    return
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    alert('Access Denied: You do not have administrator privileges.')
    router.push('/')
    return
  }

  isLoggedIn.value = true
  isLoading.value = false
  fetchPromotions()
}

onMounted(() => {
  checkAdminAccess()
})

const fetchPromotions = async () => {
  try {
    const res = await fetch(`${API_URL}/api/admin/promotions`)
    promotions.value = await res.json()
  } catch (err) {
    console.error('Fetch error', err)
  }
}

const onFileChange = (e: any) => {
  selectedFile.value = e.target.files[0]
}

const resetForm = () => {
  description.value = ''
  endAt.value = ''
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
  endAt.value = promo.end_at ? promo.end_at.split('T')[0] : ''
  editingId.value = promo.id
  showForm.value = true
  message.value = ''
}

const handleSave = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  const formData = new FormData()
  // We'll pass the access token instead of a static password
  formData.append('access_token', session?.access_token || '')
  formData.append('description', description.value)
  formData.append('end_at', endAt.value)
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
      message.value = `Error: ${data.error || 'Unknown error'}`
    }
  } catch (err: any) {
    message.value = `Save error: ${err.message}`
  }
}

const goHome = () => {
  router.push('/')
}

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/')
}

const handleDelete = async (id: number) => {
  if (!confirm('Are you sure you want to delete this promotion?')) return
  const { data: { session } } = await supabase.auth.getSession()

  try {
    const res = await fetch(`${API_URL}/api/admin/promotions/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: session?.access_token })
    })
    const data = await res.json()
    if (data.success) {
      fetchPromotions()
      message.value = 'Deleted successfully'
    } else {
      message.value = `Error: ${data.error || 'Access Denied'}`
    }
  } catch (err) {
    message.value = 'Delete error'
  }
}
</script>

<template>
  <div class="admin-dashboard">
    <!-- Loading State -->
    <LoadingSpinner v-if="isLoading" message="loading" :fullScreen="true" />

    <!-- Authenticated State -->
    <div v-else class="dashboard-layout">
      <!-- Mobile Sidebar Toggle -->
      <button class="mobile-toggle-btn" @click="toggleSidebar">
        {{ isSidebarOpen ? '✕' : '☰' }}
      </button>

      <!-- Sidebar -->
      <aside class="sidebar" :class="{ 'mobile-open': isSidebarOpen }">
        <div class="sidebar-header">
          <span class="brand">S HATYAI</span>
          <p class="role-tag">Administrator</p>
        </div>
        <nav class="sidebar-nav">
          <button class="nav-item active">
            <span class="icon">★</span> Promotions
          </button>
        </nav>
        <div class="sidebar-footer">
          <button class="btn-logout" @click="handleLogout">Logout</button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <header class="content-header">
          <div class="header-left">
            <h1>Promotions Management</h1>
            <p>Create and manage active special offers</p>
          </div>
          <div class="header-right">
            <button v-if="!showForm" class="btn-luxury" @click="openCreateForm">+ New Promotion</button>
            <button v-else class="btn-secondary" @click="resetForm">Cancel & Close</button>
          </div>
        </header>

        <div class="content-body">
          <p v-if="message && !showForm" class="status-banner">{{ message }}</p>

          <!-- Promotion Form -->
          <div v-if="showForm" class="form-section fade-in">
            <div class="luxury-card">
              <h3>{{ editingId ? 'Edit' : 'Create' }} Promotion</h3>
              <div class="card-body">
                <div class="form-grid">
                  <div class="form-group">
                    <label>Promotion Image</label>
                    <div class="file-input-wrapper">
                      <input type="file" @change="onFileChange" accept="image/*" />
                      <p class="file-hint">Recommended: 1200x800px or larger</p>
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Expiration Date (Optional)</label>
                    <input type="date" v-model="endAt" />
                  </div>
                  <div class="form-group full-width">
                    <label>Description / Details</label>
                    <textarea v-model="description" placeholder="Write promotion details here..."></textarea>
                  </div>
                </div>
                <div class="form-footer">
                  <button class="btn-luxury" @click="handleSave">Save Promotion</button>
                  <button class="btn-secondary" @click="resetForm">Discard Changes</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Promotion List -->
          <div v-else class="list-section fade-in">
            <div class="stats-overview">
              <div class="stat-card">
                <span class="stat-label">Total Promotions</span>
                <span class="stat-value">{{ promotions.length }}</span>
              </div>
            </div>

            <div class="promo-grid">
              <div v-for="promo in promotions" :key="promo.id" class="luxury-promo-card">
                <div class="promo-img">
                  <img v-if="promo.image_url" :src="promo.image_url.startsWith('http') ? promo.image_url : `${API_URL}${promo.image_url}`" />
                  <div v-else class="img-placeholder">S HATYAI</div>
                </div>
                <div class="promo-details">
                  <p class="promo-desc">{{ promo.description }}</p>
                  <div class="promo-meta">
                    <div class="meta-item">
                      <span class="meta-label">Created:</span>
                      <span class="meta-value">{{ new Date(promo.created_at).toLocaleDateString() }}</span>
                    </div>
                    <div v-if="promo.end_at" class="meta-item expiry">
                      <span class="meta-label">Expires:</span>
                      <span class="meta-value">{{ new Date(promo.end_at).toLocaleDateString() }}</span>
                    </div>
                  </div>
                  <div class="promo-actions">
                    <button class="btn-edit" @click="openEditForm(promo)">Edit</button>
                    <button class="btn-delete" @click="handleDelete(promo.id)">Delete</button>
                  </div>
                </div>
              </div>
              
              <div v-if="promotions.length === 0" class="empty-state">
                <p>No promotions found. Start by creating your first one.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <!-- Close floating button for small screens -->
      <button class="btn-exit-dashboard" @click="goHome">Exit</button>
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard {
  position: fixed;
  inset: 0;
  background: #f8f9fa;
  z-index: 10000;
  font-family: 'Inter', sans-serif;
  color: #1a1a1a;
}

/* Login Screen */
.login-screen {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}

.login-box {
  background: #fff;
  padding: 50px;
  width: 100%;
  max-width: 400px;
  border-radius: 4px;
  box-shadow: 0 30px 60px rgba(0,0,0,0.3);
}

.login-header { text-align: center; margin-bottom: 40px; }
.brand { font-family: var(--font-serif); letter-spacing: 0.3em; color: var(--color-accent); font-weight: 700; font-size: 1.2rem; display: block; margin-bottom: 10px; }
.login-header h2 { font-size: 1.5rem; text-transform: uppercase; letter-spacing: 0.1em; }

.form-group { margin-bottom: 20px; }
.form-group label { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #666; margin-bottom: 8px; }
.form-group input, .form-group textarea {
  width: 100%; padding: 12px; border: 1px solid #ddd; background: #fff; font-family: inherit;
}
.form-group input:focus { border-color: #000; outline: none; }

.error-msg { color: #d32f2f; text-align: center; font-size: 0.85rem; margin-top: 15px; }
.btn-back { background: none; border: none; color: #888; width: 100%; margin-top: 20px; cursor: pointer; font-size: 0.85rem; }

/* Dashboard Layout */
.dashboard-layout { display: flex; height: 100vh; }

/* Sidebar */
.sidebar {
  width: 260px;
  background: #111;
  color: #fff;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header { padding: 40px 30px; border-bottom: 1px solid #222; }
.role-tag { font-size: 0.7rem; color: #666; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 5px; }

.sidebar-nav { flex: 1; padding: 20px 15px; }
.nav-item {
  width: 100%; display: flex; align-items: center; padding: 12px 15px; background: transparent; border: none;
  color: #aaa; cursor: pointer; border-radius: 4px; transition: all 0.3s; margin-bottom: 5px; font-weight: 500;
}
.nav-item.active { background: var(--color-accent); color: #fff; }
.nav-item .icon { margin-right: 12px; font-size: 1.1rem; }

.sidebar-footer { padding: 20px; border-top: 1px solid #222; }
.btn-logout { width: 100%; padding: 10px; background: transparent; border: 1px solid #333; color: #888; cursor: pointer; }

/* Main Content */
.main-content { flex: 1; overflow-y: auto; background: #f4f4f4; }
.content-header {
  background: #fff; padding: 30px 50px; display: flex; justify-content: space-between; align-items: center;
  border-bottom: 1px solid #eee; position: sticky; top: 0; z-index: 10;
}
.content-header h1 { font-family: var(--font-serif); font-size: 1.8rem; margin-bottom: 5px; }
.content-header p { color: #888; font-size: 0.9rem; }

.content-body { padding: 40px 50px; max-width: 1200px; margin: 0 auto; }

.status-banner { background: #e8f5e9; color: #2e7d32; padding: 15px 25px; border-radius: 4px; margin-bottom: 30px; font-weight: 600; }

/* Luxury Cards */
.luxury-card { background: #fff; border-radius: 4px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); overflow: hidden; }
.luxury-card h3 { padding: 20px 30px; background: #fafafa; border-bottom: 1px solid #eee; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.05em; }
.card-body { padding: 30px; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
.full-width { grid-column: span 2; }
.form-footer { margin-top: 40px; display: flex; gap: 15px; padding-top: 30px; border-top: 1px solid #eee; }

/* Promo List */
.stats-overview { margin-bottom: 40px; }
.stat-card { background: #fff; padding: 20px 30px; border-radius: 4px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); display: inline-flex; flex-direction: column; }
.stat-label { font-size: 0.75rem; color: #888; text-transform: uppercase; margin-bottom: 5px; }
.stat-value { font-size: 2rem; font-weight: 700; }

.promo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 30px; }

.luxury-promo-card { background: #fff; border-radius: 4px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: transform 0.3s; }
.luxury-promo-card:hover { transform: translateY(-5px); }

.promo-img { height: 200px; background: #111; overflow: hidden; }
.promo-img img { width: 100%; height: 100%; object-fit: cover; }
.img-placeholder { height: 100%; display: flex; align-items: center; justify-content: center; color: #333; font-family: var(--font-serif); letter-spacing: 0.3em; }

.promo-details { padding: 25px; }
.promo-desc { font-size: 0.95rem; line-height: 1.6; color: #333; margin-bottom: 20px; height: 3.2em; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }

.promo-meta { display: flex; flex-direction: column; gap: 8px; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
.meta-item { display: flex; justify-content: space-between; font-size: 0.8rem; }
.meta-label { color: #999; }
.meta-value { color: #111; font-weight: 600; }
.expiry .meta-value { color: #d32f2f; }

.promo-actions { display: flex; gap: 12px; }
.promo-actions button { flex: 1; padding: 10px; border-radius: 4px; font-size: 0.8rem; font-weight: 700; cursor: pointer; border: none; }
.btn-edit { background: #f0f0f0; color: #111; }
.btn-delete { background: #fff1f0; color: #cf1322; }

.btn-luxury {
  background: #000; color: #fff; border: none; padding: 14px 28px; cursor: pointer; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase;
  transition: background 0.3s;
}
.btn-luxury:hover { background: #222; }
.btn-secondary { background: #eee; color: #111; border: none; padding: 14px 28px; cursor: pointer; font-weight: 700; font-size: 0.85rem; }

.btn-exit-dashboard {
  position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px; border-radius: 50%; background: #000; color: #fff; border: none; cursor: pointer;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3); font-weight: 700; z-index: 100;
}

.fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* Updated Responsive Styles */
.mobile-toggle-btn {
  display: none; position: fixed; top: 20px; left: 20px; z-index: 10100;
  width: 40px; height: 40px; background: #000; color: #fff; border: none; cursor: pointer;
  align-items: center; justify-content: center; border-radius: 4px;
}
.sidebar-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 10050;
}

@media (max-width: 900px) {
  .mobile-toggle-btn { display: flex; }

  .sidebar {
    position: fixed;
    left: -260px; top: 0; bottom: 0; z-index: 10100;
    transition: left 0.3s ease;
    background: #111;
  }

  .sidebar.mobile-open { left: 0; box-shadow: 0 0 20px rgba(0,0,0,0.5); }
  
  .content-header { padding: 20px; padding-left: 70px; }
  .content-header h1 { font-size: 1.4rem; }
  
  .content-body { padding: 20px; }
  
  .promo-grid { grid-template-columns: 1fr; gap: 20px; }
  
  .form-grid { grid-template-columns: 1fr; gap: 20px; }
  .full-width { grid-column: span 1; }
  
  .luxury-card h3 { padding: 15px 20px; }
  .card-body { padding: 20px; }
  
  .desktop-only { display: none; }
}

@media (max-width: 480px) {
  .promo-actions { flex-direction: column; }
  .btn-luxury, .btn-secondary { padding: 12px 20px; font-size: 0.8rem; }
  .header-right .btn-luxury { padding: 8px 16px; }
}
</style>
