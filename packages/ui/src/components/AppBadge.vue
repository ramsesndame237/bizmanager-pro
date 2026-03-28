<script setup lang="ts">
export type BadgeColor = 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'orange' | 'purple'

const props = withDefaults(
  defineProps<{
    color?: BadgeColor
  }>(),
  { color: 'gray' },
)

const colorClasses: Record<BadgeColor, string> = {
  green: 'bg-green-100 text-green-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  red: 'bg-red-100 text-red-800',
  blue: 'bg-blue-100 text-blue-800',
  gray: 'bg-gray-100 text-gray-800',
  orange: 'bg-orange-100 text-orange-800',
  purple: 'bg-purple-100 text-purple-800',
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      colorClasses[color],
    ]"
  >
    <slot />
  </span>
</template>
