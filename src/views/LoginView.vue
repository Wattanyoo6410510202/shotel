<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { useRouter } from 'vue-router'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const router = useRouter()
const isLogin = ref(true)
const email = ref('')
const password = ref('')
const fullName = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const message = ref('')

onMounted(() => {
  // Load remembered email if exists
  const savedEmail = localStorage.getItem('remembered_email')
  if (savedEmail) {
    email.value = savedEmail
    rememberMe.value = true
  }
})

const handleAuth = async () => {
  loading.value = true
  message.value = ''
  
  try {
    if (isLogin.value) {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      if (error) throw error

      // Remember Me Logic
      if (rememberMe.value) {
        localStorage.setItem('remembered_email', email.value)
      } else {
        localStorage.removeItem('remembered_email')
      }

      router.push('/')
    } else {
// ... rest of register logic
      const { error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
          data: {
            full_name: fullName.value,
          }
        }
      })
      if (error) throw error
      message.value = 'Registration successful! You can now log in.'
      isLogin.value = true
    }
  } catch (error: any) {
    message.value = error.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <LoadingSpinner v-if="loading" :fullScreen="true" message="loading" />
    <div v-else class="auth-container">
      <div class="auth-header">
        <router-link to="/" class="brand">S HATYAI</router-link>
        <h1>{{ isLogin ? 'Welcome Back' : 'Create Account' }}</h1>
        <p>{{ isLogin ? 'Login to manage your profile and bookings' : 'Join our membership for exclusive offers' }}</p>
      </div>

      <form @submit.prevent="handleAuth" class="auth-form">
        <div v-if="!isLogin" class="form-group">
          <label>Full Name</label>
          <input v-model="fullName" type="text" placeholder="Your Name" required />
        </div>
        
        <div class="form-group">
          <label>Email Address</label>
          <input v-model="email" type="email" placeholder="email@example.com" required />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="••••••••" required />
        </div>

        <!-- Remember Me Checkbox -->
        <div v-if="isLogin" class="remember-me">
          <label class="checkbox-container">
            <input type="checkbox" v-model="rememberMe" />
            <span class="checkmark"></span>
            Remember me
          </label>
        </div>

        <button type="submit" class="btn-luxury" :disabled="loading">
          {{ loading ? 'Processing...' : (isLogin ? 'Login' : 'Register') }}
        </button>

        <p v-if="message" class="auth-message" :class="{ error: !message.includes('successful') }">
          {{ message }}
        </p>

        <div class="auth-toggle">
          {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
          <button type="button" @click="isLogin = !isLogin">
            {{ isLogin ? 'Register now' : 'Login here' }}
          </button>
        </div>
      </form>
      
      <router-link to="/" class="btn-back">← Back to Website</router-link>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  padding: 20px;
}

.auth-container {
  background: #fff;
  padding: 50px;
  width: 100%;
  max-width: 450px;
  border-radius: 4px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.05);
}

.auth-header { text-align: center; margin-bottom: 40px; }
.brand { 
  font-family: var(--font-serif); 
  letter-spacing: 0.3em; 
  color: var(--color-accent); 
  font-weight: 700; 
  font-size: 1.4rem; 
  text-decoration: none;
  display: block;
  margin-bottom: 20px;
}

h1 { font-family: var(--font-serif); font-size: 1.8rem; margin-bottom: 10px; text-transform: uppercase; }
.auth-header p { color: #888; font-size: 0.9rem; }

.auth-form { display: flex; flex-direction: column; gap: 20px; }

.form-group label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 8px;
}

input {
  width: 100%;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #000;
}

.btn-luxury {
  background: #000;
  color: #fff;
  border: none;
  padding: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 10px;
}

.btn-luxury:hover:not(:disabled) { background: #222; }
.btn-luxury:disabled { opacity: 0.5; cursor: not-allowed; }

/* Remember Me Styling */
.remember-me { margin-top: -10px; }
.checkbox-container {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 30px;
  cursor: pointer;
  font-size: 0.85rem;
  color: #666;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #eee;
  border-radius: 3px;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: #ccc;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #000;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 7px;
  top: 3px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.auth-message {
  text-align: center;
  font-size: 0.85rem;
  padding: 10px;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 4px;
}

.auth-message.error {
  background: #ffebee;
  color: #c62828;
}

.auth-toggle {
  text-align: center;
  font-size: 0.9rem;
  color: #666;
  margin-top: 20px;
}

.auth-toggle button {
  background: none;
  border: none;
  color: #000;
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  margin-left: 5px;
}

.btn-back {
  display: block;
  text-align: center;
  margin-top: 30px;
  color: #888;
  text-decoration: none;
  font-size: 0.85rem;
}

.btn-back:hover { color: #000; }
</style>
