import Vue from 'vue'
import Vuex from 'vuex'

import { getJSON } from '@/lib/cookies'
import { isNull } from '@/lib/utils'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    email: "",
    permissions: {}
  },
  mutations: {
    initialiseStore(state) {
      var cookie =  getJSON();
      if(cookie != null) {
          state.email = cookie.email;
          state.permissions = cookie.permissions;
      }
    },
    login(state, payload) {
        state.email = payload.email;
        state.permissions = payload.permissions;
    },
    logout(state) {
        localStorage.removeItem("sm-portal.store");
        state.email = "";
        state.permissions = {};
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
    }
  }
})
