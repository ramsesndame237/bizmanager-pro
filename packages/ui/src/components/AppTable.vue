<script setup lang="ts" generic="T extends Record<string, unknown>">
export interface TableColumn<Row> {
  key: string
  label: string
  sortable?: boolean
  class?: string
  render?: (row: Row) => string
}

const props = withDefaults(
  defineProps<{
    columns: TableColumn<T>[]
    rows: T[]
    loading?: boolean
    emptyText?: string
    rowKey?: string
  }>(),
  {
    loading: false,
    emptyText: 'No data to display',
    rowKey: 'id',
  },
)

const emit = defineEmits<{
  'row-click': [row: T]
  sort: [key: string]
}>()

function getCellValue(row: T, key: string): unknown {
  return key.split('.').reduce<unknown>((obj, k) => {
    if (obj && typeof obj === 'object') {
      return (obj as Record<string, unknown>)[k]
    }
    return undefined
  }, row)
}
</script>

<template>
  <div class="overflow-x-auto rounded-xl border border-gray-200">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            scope="col"
            :class="[
              'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500',
              col.sortable ? 'cursor-pointer select-none hover:text-gray-700' : '',
              col.class ?? '',
            ]"
            @click="col.sortable && emit('sort', col.key)"
          >
            <span class="flex items-center gap-1">
              {{ col.label }}
              <svg
                v-if="col.sortable"
                class="h-3.5 w-3.5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 9l4-4 4 4M16 15l-4 4-4-4" />
              </svg>
            </span>
          </th>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-100 bg-white">
        <!-- Loading state -->
        <tr v-if="loading">
          <td :colspan="columns.length" class="px-4 py-10 text-center">
            <div class="flex justify-center">
              <svg
                class="h-6 w-6 animate-spin text-primary-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          </td>
        </tr>

        <!-- Empty state -->
        <tr v-else-if="rows.length === 0">
          <td :colspan="columns.length" class="px-4 py-10 text-center text-sm text-gray-400">
            {{ emptyText }}
          </td>
        </tr>

        <!-- Data rows -->
        <tr
          v-for="row in rows"
          v-else
          :key="String(row[rowKey] ?? '')"
          class="transition-colors hover:bg-gray-50 cursor-pointer"
          @click="emit('row-click', row)"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            :class="['px-4 py-3 text-sm text-gray-700', col.class ?? '']"
          >
            <slot :name="`cell-${col.key}`" :row="row" :value="getCellValue(row, col.key)">
              {{ col.render ? col.render(row) : getCellValue(row, col.key) }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
