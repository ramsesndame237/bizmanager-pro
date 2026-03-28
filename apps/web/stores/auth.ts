import { defineStore } from 'pinia'
import type { Role } from '@bizmanager/shared-types'

interface AuthUser {
  id: string
  email: string
  name: string
  role: Role
}

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.accessToken && !!state.user,
    userRole: (state): Role | null => state.user?.role ?? null,
  },

  actions: {
    setAuth(user: AuthUser, accessToken: string) {
      this.user = user
      this.accessToken = accessToken
    },

    clearAuth() {
      this.user = null
      this.accessToken = null
    },
  },

  persist: {
    storage: persistedState.cookiesWithOptions({ sameSite: 'strict' }),
    pick: ['user', 'accessToken'],
  },
})
