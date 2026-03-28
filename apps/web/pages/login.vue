<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const authStore = useAuthStore()

if (authStore.isAuthenticated) {
  await navigateTo('/')
}
</script>

<template>
  <div class="card p-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Connexion</h1>
    <p class="text-gray-500 text-sm">Authentification à implémenter (Issue #4)</p>
  </div>
</template>
