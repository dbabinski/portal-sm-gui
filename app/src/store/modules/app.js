import { getCookie, setCookie } from "@/lib/cookies";

const state = {
  sidebar: {
    opened: getCookie("sidebarStatus") ? !!+getCookie("sidebarStatus") : true,
  },
}

const mutations = {
  TOGGLE_SIDEBAR(state) {
    state.sidebar.opened = !state.sidebar.opened;
    if (state.sidebar.opened) {
      setCookie("sidebarStatus", false);
    } else {
      setCookie("sidebarStatus", true);
    }
  },
  CLOSE_SIDEBAR(state) {
    setCookie("sidebarStatus", false);
    state.sidebar.opened = false;
  },
}

const actions = {
  toggleSidebar(state) {
    state.commit('TOGGLE_SIDEBAR');
  },
  closeSidebar(state) {
    state.commit('CLOSE_SIDEBAR');
  },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}