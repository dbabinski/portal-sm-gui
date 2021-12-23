<template>
  <v-app id="inspire" class="app-wrapper">
    <sidebar app v-model="drawer" class="sidebar-container" />
    <navbar v-model="drawer" app/>
    <v-main>
      <app-main />
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "LayoutAdmin",
  data(){
    return{
      drawer: null
    }
  },
  components: {
    AppMain: () => import("./components/AppMain.vue"),
    Navbar: () => import("./components/Navbar.vue"),
    Sidebar: () => import("./components/Sidebar/index.vue"),
  },
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
    }),

    classObj() {
      return {
        hideDrawer: !this.sidebar.opened,
        drawer: this.sidebar.opened,
      };
    },
  }
};
</script>

<style>
/* .app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}
.main-container {
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: 204px;
  position: relative;
} 
.hideSidebar {
  width: calc(100% - 54px);
}
.hideSidebar .sidebar-container {
  width: 54px !important;
}
.hideSidebar .main-container {
  margin-left: 54px;
}
.sidebar-container {
  transition: width 0.28s;
  background-color: red;
  width: 201px !important;
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
}
.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - 201px);
  transition: width 0.28s;
}
.hideSidebar .fixed-header {
  width: calc(100% - 54px);
} */
</style>