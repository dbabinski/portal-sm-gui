import { getJSON } from "@/lib/cookies";

const state = {
  email: "",
  permissions: {},
  token: "",
  scope: "",
  id: ""
}

const mutations = {
  initialiseStore(state) {
    var cookie = getJSON();
    if (cookie != null) {
      state.email = cookie.email;
      state.permissions = cookie.permissions;
      state.token = cookie.jti;
      state.token = cookie.scope;
      state.id = cookie.id;
    }
  },
  login(state, payload) {
    state.email = payload.email;
    state.permissions = payload.permissions;
    state.token = payload.token;
    state.scope = payload.scope;
    state.id = payload.id;
  },
  logout(state) {
    localStorage.removeItem('sm-portal.store');
    state.email = "";
    state.permissions = {};
    state.token = "";
    state.scope = "";
    state.id = "";
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
