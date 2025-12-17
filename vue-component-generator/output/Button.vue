<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>

<template>
  <button
    :class="['btn', props.variant, props.size]"
    :disabled="props.disabled || props.loading"
    @click="handleClick"
  >
    <span v-if="props.loading" class="spinner" />
    <slot v-else />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.primary { background: #3b82f6; color: white; }
.primary:hover:not(:disabled) { background: #2563eb; }
.secondary { background: #64748b; color: white; }
.outline { background: transparent; border: 1px solid #3b82f6; color: #3b82f6; }
.ghost { background: transparent; color: #3b82f6; }

.sm { padding: 0.5rem 0.75rem; font-size: 0.875rem; }
.md { padding: 0.75rem 1rem; font-size: 1rem; }
.lg { padding: 1rem 1.5rem; font-size: 1.125rem; }

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
