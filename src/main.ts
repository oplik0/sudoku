import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import { useStore } from "./store";

createApp(App)
    .use(useStore())
    .mount("#app");
