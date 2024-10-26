import '@fortawesome/fontawesome-free/css/all.css'
import "bootstrap/dist/css/bootstrap.min.css"
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
window.bootstrap = bootstrap;

import * as coreui from '@coreui/coreui'; 
window.coreui = coreui;

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

