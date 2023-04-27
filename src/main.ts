import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import vuetify from './plugins/vuetify';
import CardPlayerSpecList from "@/components/CardPlayerSpecList.vue";

const app = createApp(App)

app.config.globalProperties.$axios = axios;
app.component('card-player-spec-list', CardPlayerSpecList);

app.use(vuetify).use(store).use(router).mount('#app')
