import { vm } from "@/main";
import { set, get } from "../utils";
const state = {
  loading: false,
  settings: { animations: true },
  ipLongLat: [],
  prevRoute: ""
};
const getters = {
  getLoadingState: get("loading"),
  getSettings: get("settings"),
  getIpLongLat: get("ipLongLat"),
  getprevRoute: get("prevRoute")
};

const actions = {
  getIpLookUp({ commit }) {
    /* find user location based on ip */
    return vm.$http
      .get("https://ipapi.co/json/", { crossDomain: true })
      .then(resp => {
        const { longitude, latitude } = resp.data;
        commit("setIpLookUp", [latitude, longitude]);
        return [latitude, longitude];
      })
      .catch(err => {
        commit("setIpLookUp", []);
        throw err;
      });
  },
  createAlert(ctx, data) {
    vm.$toast(data.text || data, { ...data.config });
  },
  alertError(ctx, data) {
    console.log(data);
    vm.$toast(data.text || data, {
      color: "error",
      queueable: true,
      ...data.config
    });
  },
  alertSuccess(ctx, data) {
    vm.$toast(data.text || data, {
      color: "success",
      ...data.config
    });
  },
  getSettings({ commit }) {
    const settings = JSON.parse(localStorage.getItem("settings"));
    commit("setSettings", settings || { animations: false });
  }
};
const mutations = {
  setLoadingState: set("loading"),
  setIpLookUp: set("ipLongLat"),
  setprevRoute: set("prevRoute"),

  setSettings(state, payload) {
    state.settings = Object.assign(state.settings, payload);
    localStorage.setItem("settings", JSON.stringify(state.settings));
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
