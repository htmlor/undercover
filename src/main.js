import { createApp } from "vue";
import { createPinia } from "pinia";
// import { vLongpress } from "@nanogiants/vue3-longpress";
import { router } from "./router";
// import { i18n, loadLanguageAsync } from "./i18n";
import "./style.css";
import "tdesign-vue-next/es/style/index.css";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

// router.beforeEach((to, from, next) => {
//   const storageKey = "lang";
//   const localLang = localStorage.getItem(storageKey);
//   const queryLang = to.query.lang;
//   if (queryLang) {
//     localStorage.setItem(storageKey, queryLang);
//   }
//   const lang = queryLang || localLang || "zh";
//   loadLanguageAsync(lang).then(() => next());
// });

app.use(router);
// app.use(i18n);
app.use(pinia);
// app.directive("use-longpress", vLongpress);

app.mount("#app");
