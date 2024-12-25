import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'


const app = createApp(App)
const pinia = createPinia();
import 'uno.css'

app.use(pinia);
app.use(router)
app.mount('#app')
