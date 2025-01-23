import { createApp } from 'vue'
import pinia from './stores';
import App from './App.vue'
import router from './router'
import 'uno.css'
import 'bulma/css/bulma.css'  // Importando o Bulma



const app = createApp(App);

app.use(pinia);
app.use(router)
app.mount('#app')
