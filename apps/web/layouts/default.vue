<script setup lang="ts">
import { Role } from '@bizmanager/shared-types'

const authStore = useAuthStore()

interface NavItem {
  label: string
  icon: string
  to: string
  roles: Role[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: 'lucide:layout-dashboard', to: '/', roles: [Role.ADMIN, Role.CASHIER, Role.TECHNICIAN, Role.HR, Role.EMPLOYEE] },
  { label: 'Stock', icon: 'lucide:package', to: '/stock', roles: [Role.ADMIN, Role.CASHIER, Role.TECHNICIAN] },
  { label: 'Billing', icon: 'lucide:file-text', to: '/billing', roles: [Role.ADMIN, Role.CASHIER] },
  { label: 'Repairs', icon: 'lucide:wrench', to: '/repairs', roles: [Role.ADMIN, Role.CASHIER, Role.TECHNICIAN] },
  { label: 'Equipment', icon: 'lucide:cpu', to: '/equipment', roles: [Role.ADMIN, Role.TECHNICIAN] },
  { label: 'HR', icon: 'lucide:users', to: '/hr', roles: [Role.ADMIN, Role.HR] },
  { label: 'Reports', icon: 'lucide:bar-chart-2', to: '/reports', roles: [Role.ADMIN] },
]

const visibleItems = computed(() =>
  navItems.filter((item) => !authStore.userRole || item.roles.includes(authStore.userRole as Role)),
)

const isSidebarOpen = ref(true)

async function handleLogout() {
  authStore.clearAuth()
  await navigateTo('/login')
}
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-gray-50">
    <!-- Sidebar -->
    <aside
      :class="['flex flex-col bg-white border-r border-gray-200 transition-all duration-200', isSidebarOpen ? 'w-64' : 'w-16']"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 px-4 py-5 border-b border-gray-200">
        <div class="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
          <span class="text-white font-bold text-sm">B</span>
        </div>
        <span v-if="isSidebarOpen" class="font-bold text-gray-900 truncate">BizManager Pro</span>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <NuxtLink
          v-for="item in visibleItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          active-class="bg-primary-50 text-primary-700 font-medium"
        >
          <Icon :name="item.icon" class="w-5 h-5 flex-shrink-0" />
          <span v-if="isSidebarOpen" class="truncate">{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <!-- User section -->
      <div class="px-2 py-4 border-t border-gray-200">
        <button
          @click="handleLogout"
          class="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <Icon name="lucide:log-out" class="w-5 h-5 flex-shrink-0" />
          <span v-if="isSidebarOpen">Sign out</span>
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top bar -->
      <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button
          @click="isSidebarOpen = !isSidebarOpen"
          class="text-gray-500 hover:text-gray-700"
        >
          <Icon name="lucide:menu" class="w-5 h-5" />
        </button>
        <div class="flex-1" />
        <span class="text-sm text-gray-500">{{ authStore.user?.name }}</span>
        <span class="badge badge-blue">{{ authStore.userRole }}</span>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
