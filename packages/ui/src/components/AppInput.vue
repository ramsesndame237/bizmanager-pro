<script setup lang="ts">
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'search' | 'date'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    type?: InputType
    label?: string
    placeholder?: string
    error?: string
    hint?: string
    disabled?: boolean
    required?: boolean
    id?: string
  }>(),
  {
    type: 'text',
    disabled: false,
    required: false,
  },
)

defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputId = props.id ?? `input-${Math.random().toString(36).slice(2, 9)}`
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="inputId" class="text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="[
        'block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-0',
        'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
        error
          ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
          : 'border-gray-300 focus:border-primary-400 focus:ring-primary-100',
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
    <p v-else-if="hint" class="text-xs text-gray-500">{{ hint }}</p>
  </div>
</template>
