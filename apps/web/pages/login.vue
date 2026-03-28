<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const { apiFetch } = useApi()
const authStore = useAuthStore()
const router = useRouter()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref<string | null>(null)

async function handleLogin() {
  loading.value = true
  error.value = null
  try {
    const result = await apiFetch<{ user: unknown; accessToken: string }>('/auth/login', {
      method: 'POST',
      body: form,
    })
    authStore.setAuth(result.user as never, result.accessToken)
    await router.push('/')
  } catch {
    error.value = 'Invalid email or password'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="card w-full max-w-md p-8">
      <h1 class="text-2xl font-bold text-center text-gray-900 mb-8">BizManager Pro</h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            class="input"
            placeholder="manager@shop.com"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            autocomplete="current-password"
            class="input"
          />
        </div>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

        <button type="submit" class="btn-primary w-full" :disabled="loading">
          <span v-if="loading">Signing in...</span>
          <span v-else>Sign in</span>
        </button>
      </form>
    </div>
  </div>
</template>
