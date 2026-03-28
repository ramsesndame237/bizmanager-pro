import type { FetchOptions } from 'ofetch'

export function useApi() {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  async function apiFetch<T>(path: string, options?: FetchOptions): Promise<T> {
    return $fetch<T>(`${config.public.apiBaseUrl}${path}`, {
      ...options,
      headers: {
        ...(options?.headers ?? {}),
        ...(authStore.accessToken
          ? { Authorization: `Bearer ${authStore.accessToken}` }
          : {}),
      },
      async onResponseError({ response }) {
        if (response.status === 401) {
          authStore.clearAuth()
          await navigateTo('/login')
        }
      },
    })
  }

  return { apiFetch }
}
