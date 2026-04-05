<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  alt: { type: String, default: '' },
})

const scheme = ref('xanderu')
const mounted = ref(false)
let observer = null

onMounted(() => {
  mounted.value = true
  // Read initial scheme
  const saved = localStorage.getItem('craft-docs-scheme')
  if (saved) scheme.value = saved
  const match = document.documentElement.className.match(/scheme-(\w+)/)
  if (match) scheme.value = match[1]

  // Watch for changes
  observer = new MutationObserver(() => {
    const m = document.documentElement.className.match(/scheme-(\w+)/)
    scheme.value = m ? m[1] : 'xanderu'
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <img
    v-if="mounted"
    :src="`/CRAFT/screenshots/${name}-${scheme}.png`"
    :alt="alt || name"
    class="scheme-screenshot"
    :key="`${name}-${scheme}`"
  />
  <div v-else class="scheme-screenshot-placeholder" />
</template>

<style scoped>
.scheme-screenshot {
  width: 100%;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}
.scheme-screenshot-placeholder {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}
</style>
