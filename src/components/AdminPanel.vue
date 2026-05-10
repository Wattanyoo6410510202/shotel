<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import LoadingSpinner from './LoadingSpinner.vue'
import AdminAnalytics from './AdminAnalytics.vue'

const router = useRouter()
const isLoading = ref(true)
const promotions = ref<any[]>([])
const description = ref('')
const endAt = ref('')
const selectedFile = ref<File | null>(null)
const editingId = ref<number | null>(null)
const message = ref('')
const showForm = ref(false)
const isSidebarOpen = ref(false)
const activeTab = ref<'promotions' | 'analytics'>('promotions')
const API_URL = 'http://localhost:3001'

const toggleSidebar = () => { isSidebarOpen.value = !isSidebarOpen.value }

const checkAdminAccess = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { router.push('/login?redirect=/admin'); return }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') { alert('Access Denied'); router.push('/'); return }
  isLoading.value = false
  fetchPromotions()
}

onMounted(checkAdminAccess)

const fetchPromotions = async () => {
  try {
    const res = await fetch(`${API_URL}/api/admin/promotions`)
    promotions.value = await res.json()
  } catch (err) { console.error('Fetch error', err) }
}

const resetForm = () => {
  description.value = ''; endAt.value = ''; selectedFile.value = null; editingId.value = null; showForm.value = false; message.value = ''
}

const openCreateForm = () => { resetForm(); showForm.value = true }
const openEditForm = (promo: any) => { description.value = promo.description; endAt.value = promo.end_at ? promo.end_at.split('T')[0] : ''; editingId.value = promo.id; showForm.value = true }

const handleSave = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  const formData = new FormData()
  formData.append('access_token', session?.access_token || '')
  formData.append('description', description.value)
  formData.append('end_at', endAt.value)
  if (selectedFile.value) formData.append('image', selectedFile.value)
  const url = editingId.value ? `${API_URL}/api/admin/promotions/${editingId.value}` : `${API_URL}/api/admin/promotions`
  const method = editingId.value ? 'PUT' : 'POST'
  try {
    const res = await fetch(url, { method, body: formData })
    const data = await res.json()
    if (data.success) { message.value = 'Saved!'; fetchPromotions(); setTimeout(resetForm, 1000) }
  } catch (err: any) { message.value = `Save error` }
}

const handleLogout = async () => { await supabase.auth.signOut(); router.push('/') }
const goHome = () => router.push('/')
const onFileChange = (e: any) => selectedFile.value = e.target.files[0]
const handleDelete = async (id: number) => {
  if (!confirm('Are you sure?')) return
  const { data: { session } } = await supabase.auth.getSession()
  const res = await fetch(`${API_URL}/api/admin/promotions/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token: session?.access_token })
  })
  const data = await res.json()
  if (data.success) fetchPromotions()
}
</script>

<template>
  <div class="admin-dashboard">
    <LoadingSpinner v-if="isLoading" message="loading" :fullScreen="true" />
    <div v-else class="dashboard-layout">
      <button class="mobile-toggle-btn" @click="toggleSidebar">{{ isSidebarOpen ? '✕' : '☰' }}</button>
      <aside class="sidebar" :class="{ 'mobile-open': isSidebarOpen }">
        <div class="sidebar-header"><span class="brand">S HATYAI</span><p class="role-tag">Administrator</p></div>
        <nav class="sidebar-nav">
          <button class="nav-item" :class="{ active: activeTab === 'promotions' }" @click="activeTab = 'promotions'; isSidebarOpen = false">
            <span class="icon">★</span> Promotions
          </button>
          <button class="nav-item" :class="{ active: activeTab === 'analytics' }" @click="activeTab = 'analytics'; isSidebarOpen = false">
            <span class="icon">📊</span> Analytics
          </button>
        </nav>
        <div class="sidebar-footer"><button class="btn-logout" @click="handleLogout">Logout</button></div>
      </aside>
      <main class="main-content">
        <header class="content-header">
          <div><h1>{{ activeTab === 'promotions' ? 'Promotions Management' : 'Analytics Dashboard' }}</h1></div>
          <button v-if="activeTab === 'promotions' && !showForm" class="btn-luxury" @click="openCreateForm">+ New Promotion</button>
          <button v-else-if="activeTab === 'promotions'" class="btn-secondary" @click="resetForm">Cancel & Close</button>
        </header>
        <div class="content-body">
          <AdminAnalytics v-if="activeTab === 'analytics'" />
          <template v-else>
            <p v-if="message" class="status-banner">{{ message }}</p>
            <div v-if="showForm" class="luxury-card">
              <h3>{{ editingId ? 'Edit' : 'Create' }}</h3>
              <div class="card-body">
                <input type="file" @change="onFileChange" />
                <input type="date" v-model="endAt" />
                <textarea v-model="description"></textarea>
                <button @click="handleSave" class="btn-luxury">Save</button>
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
          </template>
        </div>
      </main>
      <button class="btn-exit-dashboard" @click="goHome">Exit</button>
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard {
  position: fixed; inset: 0; background: #fdfdfd; z-index: 10000;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #2d3436;
}
.dashboard-layout { display: flex; height: 100vh; }
.sidebar { 
  width: 280px; background: #0f172a; color: #f8fafc; 
  display: flex; flex-direction: column; box-shadow: 2px 0 10px rgba(0,0,0,0.1);
}
.sidebar-header { padding: 40px 30px; border-bottom: 1px solid rgba(255,255,255,0.05); }
.brand { font-family: 'Playfair Display', serif; letter-spacing: 0.15em; color: #e2e8f0; font-weight: 700; font-size: 1.4rem; }
.role-tag { font-size: 0.65rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 8px; }

.sidebar-nav { flex: 1; padding: 30px 20px; }
.nav-item { 
  width: 100%; display: flex; align-items: center; padding: 14px 20px; 
  background: transparent; border: none; color: #94a3b8; cursor: pointer; 
  border-radius: 8px; transition: all 0.3s ease; margin-bottom: 8px; font-weight: 500;
}
.nav-item.active { background: rgba(255,255,255,0.1); color: #fff; }
.nav-item:hover:not(.active) { background: rgba(255,255,255,0.05); color: #e2e8f0; }
.nav-item .icon { margin-right: 15px; font-size: 1.2rem; }

.sidebar-footer { padding: 30px; border-top: 1px solid rgba(255,255,255,0.05); }
.btn-logout { 
  width: 100%; padding: 12px; background: transparent; border: 1px solid #334155; 
  color: #94a3b8; cursor: pointer; border-radius: 6px; transition: 0.3s;
}
.btn-logout:hover { border-color: #ef4444; color: #ef4444; }

.main-content { flex: 1; overflow-y: auto; background: #f8fafc; }
.content-header { 
  background: #fff; padding: 30px 50px; display: flex; justify-content: space-between; 
  align-items: center; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 10;
}
.content-header h1 { font-family: 'Playfair Display', serif; font-size: 1.6rem; color: #0f172a; margin-bottom: 4px; }
.content-header p { color: #64748b; font-size: 0.85rem; }

.content-body { padding: 40px 50px; max-width: 1200px; margin: 0 auto; }
.status-banner { 
  background: #f0fdf4; color: #166534; padding: 15px 25px; border-radius: 8px; 
  margin-bottom: 30px; font-weight: 500; border-left: 4px solid #22c55e;
}

.luxury-card { background: #fff; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0; }
.promo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; }
.luxury-promo-card { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #f1f5f9; transition: 0.3s; }
.luxury-promo-card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }

.btn-luxury { background: #0f172a; color: #fff; border: none; padding: 12px 24px; cursor: pointer; border-radius: 6px; font-weight: 600; font-size: 0.85rem; }
.btn-delete { background: #fef2f2; color: #dc2626; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 600; }
.btn-exit-dashboard { 
  position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; border-radius: 50%; 
  background: #000; color: #fff; border: none; cursor: pointer; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); z-index: 100;
}
</style>
