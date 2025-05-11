import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura'
import Lara from '@primevue/themes/lara';
import AnimateOnScroll from 'primevue/animateonscroll';
import { Avatar } from 'primevue';
const app = createApp(App);
app.use(PrimeVue, {
    theme: {
        preset: Lara,
    },
});
app.directive('animateonscroll', AnimateOnScroll);
app.mount('#app');
