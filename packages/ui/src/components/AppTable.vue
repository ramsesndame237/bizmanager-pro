<script setup lang="ts" generic="T extends Record<string, unknown>">
export interface TableColumn<Row> {
  key: string
  label: string
  sortable?: boolean
  class?: string
  render?: (row: Row) => string
}

withDefaults(
  defineProps<{
    columns: TableColumn<T>[]
    rows: T[]
    loading?: boolean
    emptyText?: string
    rowKey?: string
  }>(),
  { loading: false, emptyText: 'No data', rowKey: 'id' },
)

const emit = defineEmits<{ 'row-click': [row: T]; sort: [key: string] }>()

function getCellValue(row: T, key: string): unknown {
  return key.split('.').reduce<unknown>((obj, k) => {
    if (obj && typeof obj === 'object') return (obj as Record<string, unknown>)[k]
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
            :class="['px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500', col.sortable ? 'cursor-pointer select-none hover:text-gray-700' : '', col.class ?? '']"
            @click="col.sortable && emit('sort', col.key)"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100 bg-white">
        <tr v-if="loading">
          <td :colspan="columns.length" class="px-4 py-10 text-center">
            <AppSpinner class="mx-auto" />
          </td>
        </tr>
        <tr v-else-if="rows.length === 0">
          <td :colspan="columns.length" class="px-4 py-10 text-center text-sm text-gray-400">{{ emptyText }}</td>
        </tr>
        <tr
          v-for="row in rows"
          v-else
          :key="String(row[rowKey] ?? '')"
          class="hover:bg-gray-50 cursor-pointer transition-colors"
          @click="emit('row-click', row)"
        >
          <td v-for="col in columns" :key="col.key" :class="['px-4 py-3 text-sm text-gray-700', col.class ?? '']">
            <slot :name="`cell-${col.key}`" :row="row" :value="getCellValue(row, col.key)">
              {{ col.render ? col.render(row) : getCellValue(row, col.key) }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
