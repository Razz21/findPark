import firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";
import router from "@/router";
import { set, get } from "../utils";

const auth = firebase.auth();
const functions = firebase.functions();

function getProvider(name) {
  switch (name.toLowerCase()) {
    case "google":
      return new firebase.auth.GoogleAuthProvider();
    case "github":
      return new firebase.auth.GithubAuthProvider();
    default:
      return "";
  }
}

const state = {
  status: 0,
  user: null,
  loginDialog: false,
  signUpDialog: false,
  authDialog: false
};

const getters = {
  getUser: get("user"),
  getStatus: get("status"),
  isAuthenticated: state => !!state.user && state.status > 0,
  getLoginDialog: get("loginDialog"),
  getSignUpDialog: get("signUpDialog"),
  getAuthDialog: get("authDialog")
};

const actions = {
  loadUser({ commit }, user) {
    return new Promise(resolve => {
      commit("setStatus", 1);
      if (user) {
        // check from firebase claims
        user
          .getIdTokenResult()
          .then(idTokenResult => {
            user.admin = idTokenResult.claims.admin;
          })
          .then(() => {
            commit("setUser", user);
            commit("setStatus", 2);
            // dispatch("account/loadUserAccount", user.uid, { root: true });
          })
          .catch(() => {
            commit("setUser", null);
            commit("setStatus", 3);
          })
          .finally(() => resolve());
      } else {
        commit("setUser", null);
        commit("setStatus", 3);
        resolve();
      }
    });
  },

  register({ commit, dispatch }, { email, password }) {
    commit("setStatus", 1);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        commit("setUser", user.user);
        commit("setStatus", 2);
        // commit("toggleSignUpDialog", false);
        router.push({ name: "home" });
        // todo update displayName
        // return user.updateProfile({
        //   displayName: username
        // })
      })
      .catch(err => {
        commit("setUser", null);
        commit("setStatus", 3);
        dispatch("global/alertError", err.message, { root: true });
      });
  },
  login({ commit, dispatch }, { email, password }) {
    commit("setStatus", 1);
    return auth
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        dispatch("loadUser", user.user).then(() => {
          // console.log(router.resolve(router.currentRoute.query.redirect))
          // console.log(router.currentRoute.query.redirect)
          router.push(router.currentRoute.query.redirect || { name: "home" });
        });
      })
      .catch(err => {
        commit("setUser", null);
        commit("setStatus", 3);
        dispatch("global/alertError", err.message, { root: true });
      });
  },

  socialLogin({ commit, dispatch }, providerName) {
    commit("setStatus", 1);
    const provider = getProvider(providerName);
    if (provider) {
      auth
        .signInWithPopup(provider)
        .then(user => {
          commit("setUser", user);
          commit("setStatus", 2);
          commit("toggleLoginDialog", false);
          dispatch("account/loadUserAccount", user.user.uid, {
            root: true
          }).then(() => {
            router.push(router.currentRoute.query.redirect || { name: "home" });
          });
        })
        .catch(err => {
          commit("setUser", null);
          commit("setStatus", 3);
          dispatch("global/alertError", err.message, { root: true });
        });
    } else {
      commit("setUser", null);
      commit("setStatus", 3);
      dispatch("global/alertError", "Invalid Provider!", { root: true });
    }
  },
  logout({ commit }) {
    commit("setStatus", 1);
    auth
      .signOut()
      // FIXME uncaught exception error
      .then(() => {
        commit("setUser", null);
        commit("setStatus", 2);
        router.push({ name: "home" });
      })
      .catch(() => {
        commit("setUser", null);
        commit("setStatus", 3);
      });
  },

  createAdmin({ dispatch }, email) {
    const adminRole = functions.httpsCallable("addAdminRole");
    adminRole({ email })
      .then(res => {
        dispatch("global/alertSuccess", res.data.message, { root: true });
      })
      .catch(err => {
        dispatch("global/alertError", err.message, { root: true });
      });
  }
};

const mutations = {
  setUser: set("user"),
  setStatus: set("status"),
  toggleLoginDialog: set("loginDialog"),
  toggleSignUpDialog: set("signUpDialog"),
  toggleAuthDialog: set("authDialog")
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
