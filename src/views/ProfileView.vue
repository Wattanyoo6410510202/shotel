<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { useRouter } from 'vue-router'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const router = useRouter()
const profile = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    router.push('/login')
    return
  }

  const { data,  } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (data) {
    profile.value = data
  }
  loading.value = false
})

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/')
}

const clearCache = () => {
  if (confirm('Are you sure you want to clear all website data? This will reset your preferences.')) {
    localStorage.clear()
    sessionStorage.clear()
    window.location.reload()
  }
}
</script>

<template>
  <div class="profile-page">
    <LoadingSpinner v-if="loading" message="loading" :fullScreen="true" />
    <div v-else-if="profile" class="profile-container">
      <header class="profile-header">
        <h1>My Account</h1>
        <div class="actions">
          <button @click="clearCache" class="btn-danger" style="margin-right: 10px;">Clear Data</button>
          <button @click="handleLogout" class="btn-outline">Logout</button>
        </div>
      </header>

      <div class="profile-card">
        <div class="avatar-section">
          <div class="avatar-placeholder">{{ profile.full_name?.charAt(0) || 'U' }}</div>
          <h2>{{ profile.full_name }}</h2>
          <p class="role-badge">{{ profile.role }}</p>
          
          <!-- Admin Dashboard Link -->
          <router-link v-if="profile.role === 'admin'" to="/admin" class="btn-admin-access">
            Go to Admin Dashboard
          </router-link>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <label>Full Name</label>
            <p>{{ profile.full_name || 'Not set' }}</p>
          </div>
          <div class="info-item">
            <label>Phone Number</label>
            <p>{{ profile.phone || 'Not set' }}</p>
          </div>
          <div class="info-item">
            <label>Last Updated</label>
            <p>{{ new Date(profile.updated_at).toLocaleDateString() }}</p>
          </div>
        </div>
      </div>

      <router-link to="/" class="btn-back">← Back to Website</router-link>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f4f4f4;
  padding: 60px 20px;
  display: flex;
  justify-content: center;
}

.profile-container {
  width: 100%;
  max-width: 800px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.profile-header h1 {
  font-family: var(--font-serif);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.profile-card {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  display: flex;
  overflow: hidden;
}

.avatar-section {
  background: #111;
  color: #fff;
  padding: 50px;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar-placeholder {
  width: 100px;
  height: 100px;
  background: var(--color-accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-family: var(--font-serif);
  margin-bottom: 20px;
}

.role-badge {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  background: rgba(255,255,255,0.1);
  padding: 5px 15px;
  border-radius: 20px;
  margin-top: 10px;
  margin-bottom: 20px;
}

.btn-admin-access {
  display: inline-block;
  background: var(--color-accent);
  color: #fff;
  text-decoration: none;
  padding: 12px 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: 4px;
  transition: opacity 0.3s;
}

.btn-admin-access:hover {
  opacity: 0.9;
}

.info-grid {
  flex: 1;
  padding: 50px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
}

.info-item label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 5px;
}

.info-item p {
  font-size: 1.1rem;
  color: #111;
  font-weight: 500;
}

.btn-outline {
  background: transparent;
  border: 1px solid #111;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.btn-danger {
  background: #cf1322;
  border: 1px solid #cf1322;
  color: #fff;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.btn-back {
  display: block;
  margin-top: 30px;
  color: #666;
  text-decoration: none;
}

@media (max-width: 700px) {
  .profile-card { flex-direction: column; }
  .avatar-section { width: 100%; padding: 40px; }
  .info-grid { padding: 30px; }
}
</style>
