import { createApp } from 'vue';
import App from './App.vue';

import router from './router';
import store from './store';

import './styles/index.css';

import { Quasar } from 'quasar';

import '@quasar/extras/roboto-font/roboto-font.css';
import '@quasar/extras/material-icons/material-icons.css';

import 'quasar/src/css/index.sass';

const app = createApp(App);

app.use(Quasar);
app.use(router);
app.use(store);

app.mount('#app');
