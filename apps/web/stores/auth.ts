import type { User } from '@bizmanager/shared-types'

interface AuthState {
  user: User | null
  accessToken: string | null
}

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null)
    const accessToken = ref<string | null>(null)

    const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
    const userRole = computed(() => user.value?.role ?? null)

    function setAuth(newUser: User, token: string) {
      user.value = newUser
      accessToken.value = token
    }

    function clearAuth() {
      user.value = null
      accessToken.value = null
    }

    return {
      user,
      accessToken,
      isAuthenticated,
      userRole,
      setAuth,
      clearAuth,
    }
  },
  {
    persist: {
      storage: persistedState.cookies,
      paths: ['accessToken', 'user'],
    },
  },
)
