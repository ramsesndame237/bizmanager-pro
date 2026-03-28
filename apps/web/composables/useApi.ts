import type { ApiResponse } from '@bizmanager/shared-types'

export function useApi() {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(authStore.accessToken
        ? { Authorization: `Bearer ${authStore.accessToken}` }
        : {}),
      ...(options.headers as Record<string, string>),
    }

    const response = await fetch(`${config.public.apiBaseUrl}${path}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      throw data
    }

    return data as ApiResponse<T>
  }

  return {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, body: unknown) =>
      request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
    put: <T>(path: string, body: unknown) =>
      request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
    patch: <T>(path: string, body: unknown) =>
      request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
    del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  }
}
