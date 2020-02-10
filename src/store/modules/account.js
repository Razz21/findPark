/* user related actions for account and locations */

import firebase from "firebase/app";
import "firebase/firestore";
import { geofirestore } from "@/firebase";
import GeoApi from "@/api/places";
import { set, get } from "../utils";

const locRef = process.env.VUE_APP_firestore_location_collection;
const userRef = process.env.VUE_APP_firestore_users_collection;

const geocollection = geofirestore.collection(locRef);

const db = firebase.firestore();

const accountRef = db.collection(userRef);
const locationRef = db.collection(locRef);

const loadLocation = locId => {
  return geocollection
    .doc(locId)
    .get()
    .then(doc => {
      // todo alert non existing doc
      if (doc.exists) {
        return GeoApi.prepareDoc(doc);
      } else {
        return false;
      }
    })
    .catch(error => {
      return error;
    });
};

const state = {
  account: {},
  locations: [],
  location: null,
  loadAccountStatus: 0,
  loadLocationsStatus: 0,
  locationAddStatus: 0,
  locationRemoveStatus: 0,
  locationUpdateStatus: 0,

  editedObject: null
};

const getters = {
  getAccount: get("account"),
  getLoadAccountStatus: get("loadAccountStatus"),

  getLocations: get("locations"),
  getLoadLocationsStatus: get("loadLocationsStatus"),
  getLocationAddStatus: get("locationAddStatus"),
  getLocationUpdateStatus: get("locationUpdateStatus"),
  getLocationRemoveStatus: get("locationRemoveStatus"),

  getEditedObject: get("editedObject"),
  getLocation: get("location")
};

const actions = {
  loadUserAccount({ commit, dispatch }, uid) {
    commit("setLoadAccountStatus", 1);
    return accountRef.doc(uid).onSnapshot(
      snapshot => {
        commit("setLoadAccountStatus", 2);
        // return Promise.resolve({ ...snapshot.data(), id: snapshot.id });
        //console.log("loadUserAccount", snapshot.data());
        commit("setAccount", { ...snapshot.data(), id: snapshot.id });
      },
      error => {
        commit("setAccount", {});
        commit("setLoadAccountStatus", 3);
        dispatch("global/alertError", error.message, { root: true });
      }
    );
  },

  loadUserLocations({ commit, dispatch }, uid) {
    commit("setLoadLocationsStatus", 1);
    geocollection.where("ownerId", "==", uid).onSnapshot(
      snapshot => {
        const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        commit("setLocations", data);
        commit("setLoadLocationsStatus", 2);
      },
      error => {
        commit("setLocations", []);
        commit("setLoadLocationsStatus", 3);
        dispatch("global/alertError", error.message, { root: true });
      }
    );
  },
  loadOneLocation({}, locId) {
    return geocollection
      .doc(locId)
      .get()
      .then(doc => {
        // todo alert non existing doc
        if (doc.exists) {
          return GeoApi.prepareDoc(doc);
        } else {
          return false;
        }
      })
      .catch(error => {
        return error;
      });
  },

  addLocationGeo({ commit, dispatch }, data) {
    // todo batch
    commit("setLocationAddStatus", 1);
    return geocollection
      .add(data)
      .then(() => {
        commit("setLocationAddStatus", 2);
        dispatch("global/alertSuccess", "Success!", { root: true });
      })
      .catch(err => {
        commit("setLocationAddStatus", 3);

        dispatch("global/alertError", err.message, { root: true });
      });
  },

  updateLocation({ commit, dispatch }, data) {
    commit("setLocationUpdateStatus", 1);
    console.log(data);
    // todo update location without overwrite all data

    return geocollection
      .doc(data.id)
      .set({ ...data }, { merge: true })
      .then(() => {
        commit("setLocationUpdateStatus", 2);
        dispatch("global/createAlert", "Updated!", { root: true });
      })
      .catch(error => {
        commit("setLocationUpdateStatus", 3);
        dispatch("global/alertError", error.message, { root: true });
      });
  },
  deleteBatchLocations({ commit, dispatch }, data) {
    // input array of Objects
    commit("setLocationRemoveStatus", 1);
    const batch = db.batch();
    // const docRef = accountRef.doc(data[0].ownerId);

    for (let i = 0; i < data.length; i++) {
      batch.delete(locationRef.doc(data[i].id));
    }

    // const delCount = data.length;
    // batch.update(docRef, {
    //   locationsCount: firebase.firestore.FieldValue.increment(delCount * -1)
    // });
    batch
      .commit()
      .then(() => {
        commit("setLocationRemoveStatus", 2);
        dispatch("global/createAlert", "Deleted!", { root: true });
      })
      .catch(err => {
        commit("setLocationRemoveStatus", 3);
        dispatch("global/alertError", err.message, { root: true });
      });
  }
};
const mutations = {
  setAccount: set("account"),
  setLoadAccountStatus: set("loadAccountStatus"),
  setLocations: set("locations"),
  setLoadLocationsStatus: set("loadLocationsStatus"),
  setLocationAddStatus: set("locationAddStatus"),
  setLocationRemoveStatus: set("locationRemoveStatus"),
  setLocationUpdateStatus: set("locationUpdateStatus"),
  setEditedObject: set("editedObject")
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
