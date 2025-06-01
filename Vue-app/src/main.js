import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import 'primeicons/primeicons.css'
import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import '@/assets/styles.scss';

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(ConfirmationService);
app.component('Toast', Toast);
app.component('Dialog', Dialog);
app.mount('#app');
