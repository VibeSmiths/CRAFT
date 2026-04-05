<template>
  <div
    class="hero-carousel"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
  >
    <div class="carousel-viewport">
      <img
        v-for="(shot, i) in screenshots"
        :key="shot.src"
        :src="shot.src"
        :alt="shot.alt"
        class="carousel-slide"
        :class="{ active: i === current }"
      />
    </div>
    <div class="carousel-dots">
      <button
        v-for="(shot, i) in screenshots"
        :key="i"
        class="carousel-dot"
        :class="{ active: i === current }"
        :title="shot.alt"
        @click="jumpTo(i)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const baseScreenshots = [
  { name: 'ideas-panel', alt: 'Ideas Panel' },
  { name: 'episodes-panel', alt: 'Episode Pipeline' },
  { name: 'discover-search', alt: 'YouTube Discover' },
  { name: 'proposals-panel', alt: 'AI Proposals' },
  { name: 'resources-search', alt: 'Resource Library' },
  { name: 'audio-sections', alt: 'Audio Production' },
];

const scheme = ref('xanderu');

const screenshots = computed(() =>
  baseScreenshots.map(s => ({
    src: `/CRAFT/screenshots/${s.name}-${scheme.value}.png`,
    alt: s.alt,
  }))
);

const current = ref(0);
const paused = ref(false);
let timer: ReturnType<typeof setInterval> | null = null;

function jumpTo(i: number) {
  current.value = i;
}

function advance() {
  if (!paused.value) {
    current.value = (current.value + 1) % screenshots.value.length;
  }
}

onMounted(() => {
  scheme.value = localStorage.getItem('craft-docs-scheme') || 'xanderu';
  const observer = new MutationObserver(() => {
    const html = document.documentElement;
    const match = html.className.match(/scheme-(\w+)/);
    scheme.value = match ? match[1] : 'xanderu';
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  timer = setInterval(advance, 4000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>
