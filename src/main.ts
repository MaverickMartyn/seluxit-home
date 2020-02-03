import Vue from "vue";
import "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import store, { AppState } from "./store";
import vuetify from "./plugins/vuetify";
import VueRouter from "vue-router";
import { Store } from "vuex";
import { Vuetify } from "vuetify";

Vue.config.productionTip = false;

interface IVueApp {
  router: VueRouter;
  store: Store<AppState>;
  vuetify: Vuetify;
}

new Vue<IVueApp>({
  router,
  store: store as Store<AppState>,
  vuetify,
  render: (h: any) => h(App)
} as IVueApp).$mount("#app");
