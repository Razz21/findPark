import Vue from "vue";
import axios from "./axios";
import VuetifyToast from "./vueToast";
import moment from "moment";

Vue.prototype.$http = axios;
Vue.prototype.$moment = moment;

Vue.use(VuetifyToast, { y: "top" });
