import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import "bootstrap/dist/css/bootstrap.min.css"
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
window.bootstrap = bootstrap;

import * as coreui from '@coreui/coreui'; 
window.coreui = coreui;

import '@fortawesome/fontawesome-free/css/all.css';
import { CkeditorPlugin } from '@ckeditor/ckeditor5-vue';
import 'ckeditor5/ckeditor5.css';

const app = createApp(App);

app.use(router);
app.use(CkeditorPlugin);

app.mount('#app');

