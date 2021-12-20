import { getJSON } from "@/lib/cookies";

const state = {
  email: "",
  permissions: {},
  token: "",
  scope: "",
}

const mutations = {
  initialiseStore(state) {
    var cookie = getJSON();
    if (cookie != null) {
      state.email = cookie.email;
      state.permissions = cookie.permissions;
      state.token = cookie.token;
      state.token = cookie.scope;
    }
  },
  login(state, payload) {
    state.email = payload.email;
    state.permissions = payload.permissions;
    state.token = payload.token;
    state.scope = payload.scope;
  },
  logout(state) {
    localStorage.removeItem("sm-portal.store");
    state.email = "";
    state.permissions = {};
    state.token = "";
    state.scope = "";
  },
}

const actions = {
  login(state, payload) {
    state.commit("login", payload);
  },
  logout(state) {
    state.commit("logout");
  },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
