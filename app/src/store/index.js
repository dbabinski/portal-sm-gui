import Vue from 'vue'
import Vuex from 'vuex'

import { getJSON } from '@/lib/cookies'
import { isNull } from '@/lib/utils'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    email: "",
    permissions: {},
    token: "",
    scope: "",

  },
  mutations: {
    initialiseStore(state) {
      var cookie =  getJSON();
      if(cookie != null) {
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
    }
  },
  actions: {
    login(state, payload) {
      state.commit("login", payload);
    },
    logout(state) {
        state.commit("logout");
    }
  },
  getters: {
    email(state) {
      return state.email;
    },
    isLogged(state) {
        return !isNull(state.email);
    },
    permissions(state) {
        return state.permissions;
    },
    scope(state) {
      return state.scope;
    },
    token(state) {
      return state.token;
    }
  }
})
