import { processHoursFilter } from "@/utils";
import { set, get } from "../utils";

const state = {
  tags: [],
  text: "",
  range: 3,
  distances: [1, 5, 10, 25],
  hours: false,
  useGeoloc: false,
  useCustom: false,
  center: undefined,
  sortBy: "distance",
  items: [],
  search: ""
};

function filterAll(state, places) {
  let filtered;
  filtered = places.slice();
  const center = state.distances[state.range];

  if (!center && !state.tags.length && !state.hours) {
    return filtered;
  }
  filtered = filtered.filter(i => i.distance <= center);

  if (state.tags.length) {
    filtered = filtered.filter(i => state.tags.every(r => i.tags.includes(r)));
  }
  if (state.hours) {
    filtered = filtered.filter(i => processHoursFilter(i, state.hours));
  }
  // if (state.text) {
  //   filtered = filtered.filter(i => processTextFilter(i, state.text));
  // }

  return filtered;
}

const getters = {
  getSearch: get("search"),
  getTags: get("tags"),
  getText: get("text"),
  getDistances: get("distances"),
  getHours: get("hours"),
  getUseGeoloc: get("useGeoloc"),
  getUseCustom: get("useCustom"),
  getRange: get("range"),
  getCenter: get("center"),
  getSortBy: get("sortBy"),
  getItems: get("items"),
  getRadius: state => state.distances[state.range]
};

const actions = {
  filterPlaces({ state, commit, rootGetters }) {
    const places = rootGetters["map/getUnfilteredPlaces"];

    if (places && !places.length) return;
    const filtered = filterAll(state, places);

    commit("map/setPlaces", filtered, { root: true });
  }
};
const mutations = {
  setSearch: set("search"),
  setTags: set("tags"),
  setText: set("text"),
  setHours: set("hours"),
  setUseGeoloc: set("useGeoloc"),
  setUseCustom: set("useCustom"),
  setRange: set("range"),
  setCenter: set("center"),
  setSortBy: set("sortBy"),
  setItems: set("items")
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
