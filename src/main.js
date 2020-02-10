import Vue from "vue";
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import store from "@/store";
import firebase from "firebase/app";
import "firebase/auth";
import "@/firebase";
import "@/plugins";
import "@/directives";
import "@/filters";
import App from "@/App.vue";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

Vue.config.productionTip = false;
let vm;
firebase.auth().onAuthStateChanged(async user => {
  /* 
  wait for firebase auth before setting up vue app;
  */
  if (!vm) {
    await store.dispatch("auth/loadUser", user);
    vm = new Vue({
      vuetify,
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});

export { vm };
