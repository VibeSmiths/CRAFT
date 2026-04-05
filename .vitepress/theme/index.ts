import DefaultTheme from 'vitepress/theme';
import mediumZoom from 'medium-zoom';
import { onMounted, watch, nextTick, h, defineComponent } from 'vue';
import { useRoute } from 'vitepress';
import SchemePicker from './SchemePickerRaw.vue';
import HeroCarousel from './HeroCarousel.vue';
import SchemeImage from './SchemeImage.vue';
import './custom.css';

const CraftLayout = defineComponent({
  setup() {
    const route = useRoute();

    const initZoom = () => {
      // Detach previous zoom instances before re-attaching
      mediumZoom('.vp-doc img, .feature-screenshot img, .craft-showcase img, .scheme-screenshot', {
        background: 'rgba(0, 0, 0, 0.85)',
      });
    };

    onMounted(() => {
      // Delay to let SchemeImage v-if="mounted" render their <img> elements
      setTimeout(initZoom, 500);
      const saved = localStorage.getItem('craft-docs-scheme');
      if (saved && saved !== 'xanderu') {
        const root = document.documentElement;
        root.className = root.className.replace(/\bscheme-\w+\b/g, '').trim();
        root.classList.add(`scheme-${saved}`);
      }
    });
    watch(() => route.path, () => nextTick(() => setTimeout(initZoom, 500)));

    return () => h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h(HeroCarousel),
      'layout-bottom': () => h(SchemePicker),
    });
  },
});

export default {
  extends: DefaultTheme,
  Layout: CraftLayout,
  enhanceApp({ app }) {
    app.component('SchemeImage', SchemeImage);
  },
};
