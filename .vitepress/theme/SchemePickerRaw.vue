<template>
  <div class="scheme-picker" title="Color scheme">
    <button
      v-for="s in schemes"
      :key="s.id"
      class="scheme-swatch"
      :class="{ active: current === s.id }"
      :style="{ backgroundColor: s.swatch }"
      :title="s.label"
      @click="apply(s.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const schemes = [
  { id: 'xanderu',    label: 'Classic',     swatch: '#14b8a6' },
  { id: 'purple',     label: 'Purple',      swatch: '#a855f7' },
  { id: 'blue',       label: 'Blue',        swatch: '#3b82f6' },
  { id: 'amber',      label: 'Amber',       swatch: '#f59e0b' },
  { id: 'rose',       label: 'Rose',        swatch: '#f43f5e' },
  { id: 'liquidgold', label: 'Liquid Gold',  swatch: '#f5a623' },
  { id: 'otter',      label: 'Otter',       swatch: '#7ab88a' },
];

const current = ref('xanderu');

function apply(id: string) {
  current.value = id;
  const root = document.documentElement;
  root.className = root.className.replace(/\bscheme-\w+\b/g, '').trim();
  if (id !== 'xanderu') {
    root.classList.add(`scheme-${id}`);
  }
  localStorage.setItem('craft-docs-scheme', id);
}

onMounted(() => {
  const saved = localStorage.getItem('craft-docs-scheme');
  if (saved && saved !== 'xanderu') {
    apply(saved);
  } else if (saved) {
    current.value = saved;
  }
});
</script>
