import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./icons";
import "./filters";

import Datetime from "vue-datetime";
import "vue-datetime/dist/vue-datetime.css";
Vue.use(Datetime);

import Notifications from "vue-notification";
Vue.use(Notifications);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
