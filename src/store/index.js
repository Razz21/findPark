import Vue from "vue";
import Vuex from "vuex";
import map from "./modules/map";
import auth from "./modules/auth";
// import account from "./modules/account";
import global from "./modules/global";
import filters from "./modules/filters";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { map, auth, global, filters }
});
