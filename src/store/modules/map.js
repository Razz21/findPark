/* customer actions for locations */
import firebase from "firebase/app";
import "firebase/firestore";
import { vm } from "@/main";
import { geofirestore } from "@/firebase";
const locRef = process.env.VUE_APP_firestore_location_collection;
const geocollection = geofirestore.collection(locRef);

import GeoApi from "@/api/places";
import { RouteOSRM } from "@/api/nominatim";
import { set, get } from "../utils";
const state = {
  /* 
  status = 0 -> No request has begun
  status = 1 -> request has started
  status = 2 -> request completed successfully
  status = 3 -> request completed unsuccessfully
  */
  places: [],
  unfilteredPlaces: [],
  placesLoadstatus: 0,

  place: null,
  placeLoadstatus: 0,
  geolocation: undefined,

  showSidebar: false,
  tags: ["camera", "charging", "lit", "covered", "gated", "guarded"],
  routeData: null,
  stepGeometries: [],
  routeLoadStatus: 0
};

const getters = {
  getPlaces: get("places"),

  getUnfilteredPlaces: get("unfilteredPlaces"),

  getPlacesLoadstatus: get("placesLoadstatus"),
  getPlace: get("place"),
  getPlaceLoadstatus: get("placeLoadstatus"),

  getGeolocation: get("geolocation"),
  getTags: get("tags"),
  getShowSidebar: get("showSidebar"),
  getRouteData: get("routeData"),
  getStepGeometries: get("stepGeometries"),
  getRouteLoadStatus: get("routeLoadStatus")
};

const actions = {
  loadPlaces({ commit, dispatch, rootGetters }) {
    const radius = rootGetters["filters/getRadius"];
    const userLocation = rootGetters["filters/getCenter"];

    if (!userLocation || !userLocation.coordinates || !radius) {
      return;
    }
    commit("setPlacesLoadStatus", 1);
    vm.$toast("Searching for spots", {
      dismissable: false,
      timeout: 0,
      queueable: true,
      color: "info",
      classes: ["pulsate"]
    });
    const data = {
      center: userLocation.coordinates,
      radius
    };
    const query = GeoApi.getFilteredQuery(geocollection, data);
    return query
      .get()
      .then(snapshot => {
        // // get stored data and id of every doc
        const result = GeoApi.prepareCollectionData(snapshot);
        console.log("result", result);
        commit("setUnfilteredPlaces", result);
        dispatch("filters/filterPlaces", null, { root: true });
        // dispatch("account/loadUserAccount", user.uid, { root: true });
        commit("setPlacesLoadStatus", 2);
        vm.$toast.clearQueue();
        dispatch(
          "global/alertSuccess",
          { text: "Done!", config: { timeout: 1000 } },
          { root: true }
        );
        return result;
      })
      .catch(error => {
        commit("setPlaces", []);
        commit("setPlacesLoadStatus", 3);
        vm.$toast.clearQueue();
        dispatch("global/alertError", error.message, { root: true });
      });
  },
  loadAll({ commit, dispatch }) {
    commit("setPlacesLoadStatus", 1);
    const firestore = firebase.firestore();
    return firestore
      .collection(locRef)
      .get()
      .then(snapshot => {
        // // get stored data and id of every doc
        const preresult = GeoApi.prepareCollectionData(snapshot);
        const result = preresult.map(i => {
          const data = JSON.parse(JSON.stringify(i.d));
          return { ...data, distance: i.distance, id: i.id };
        });
        // console.log("result loadAll", result);
        commit("setPlaces", result);
        commit("setPlacesLoadStatus", 2);

        // return result;
      })
      .catch(error => {
        commit("setPlaces", []);
        commit("setPlacesLoadStatus", 3);
        dispatch("global/alertError", error.message, { root: true });
      });
  },
  loadPlace({ commit, dispatch }, placeID) {
    commit("setPlaceLoadStatus", 1);
    let place;
    return geocollection
      .doc(placeID)
      .get()
      .then(doc => {
        if (doc.exists) {
          place = GeoApi.prepareDoc(doc);
          commit("setPlace", place);
          commit("setPlaceLoadStatus", 2);
        } else {
          commit("setPlace", {});
          commit("setPlaceLoadStatus", 3);
          dispatch("global/createAlert", "Location not exists", { root: true });
        }
        return place;
      })
      .catch(error => {
        commit("setPlace", {});
        commit("setPlaceLoadStatus", 3);
        dispatch("global/alertError", error.message, { root: true });
      });
  },
  findRoute({ commit, dispatch }, data) {
    if (!data.length == 2) return;
    vm.$toast("Searching for route", {
      dismissable: false,
      timeout: 0,
      queueable: true,
      color: "info",
      classes: ["pulsate"]
    });
    commit("setRouteLoadStatus", 1);
    const [coord1, coord2] = data;
    const host = process.env.VUE_APP_OSRM_DRIVING;
    const points = [coord1, coord2].map(i => i.join());
    const routeOSRM = new RouteOSRM({ host });
    routeOSRM
      .route(points, {
        steps: true,
        geometries: "geojson"
      })
      .then(res => {
        let stepGeometries;
        stepGeometries = res.data.routes[0].legs[0].steps;
        stepGeometries = res.data.routes;

        // add user and destination coordinates to first/last step
        stepGeometries[0].geometry.coordinates.unshift(coord1);
        stepGeometries[stepGeometries.length - 1].geometry.coordinates.push(
          coord2
        );
        commit("setRouteData", res.data);
        commit("setStepGeometries", stepGeometries);
        vm.$toast.clearQueue();
        dispatch(
          "global/alertSuccess",
          { text: "Done!", config: { timeout: 1000 } },
          { root: true }
        );
        commit("setRouteLoadStatus", 2);
      })
      .catch(err => {
        console.log(err);
        commit("setRouteLoadStatus", 3);
        vm.$toast.clearQueue();
        dispatch(
          "global/alertError",
          "Something went wrong. Please try again later.",
          { root: true }
        );
      });
  }
};

const mutations = {
  setPlacesLoadStatus: set("placesLoadstatus"),
  setUnfilteredPlaces: set("unfilteredPlaces"),
  setPlaces: set("places"),
  setPlace: set("place"),
  setGeolocation: set("geolocation"),
  setShowSidebar: set("showSidebar"),
  setRouteData: set("routeData"),
  setStepGeometries: set("stepGeometries"),
  setRouteLoadStatus: set("getRouteLoadStatus"),

  removeSelected(state) {
    state.stepGeometries = [];
    state.routeData = null;
    state.place = null;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
