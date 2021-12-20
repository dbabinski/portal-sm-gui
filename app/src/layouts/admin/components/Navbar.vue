<template>
  <v-app-bar dense class="navbar" app>
    <v-app-bar-nav-icon
      class="hamburger-container"
      :is-active="sidebar.opened"
      @click="toggleSidebar"
    />
    <breadcrumb class="breadcrumb-container" />
    <user-menu class="usermenu-container"/>
    <!-- <v-btn 
    depressed
    class="logout-button-container" 
    @click.native="logout"
      >Wyloguj</v-btn
    > -->
  </v-app-bar>
</template>

<script>
import router from "@/router/index";
import store from "@/store/index";
import { mapGetters } from "vuex";

export default {
  name: "Navbar",
  components: {
    Breadcrumb: () => import("@/components/Breadcrumb"),
    UserMenu: () => import("@/components/UserMenu")
  },
  data() {
    return {

    };
  },
  computed: {
    ...mapGetters(["sidebar"]),
  },
  methods: {
    toggleSidebar() {
      this.$store.dispatch("app/toggleSidebar");
    },

    async logout() {
      //   const self = this;
      fetch("/sm-portal-server/autentykacja/logout")
        .then((res) => {
          router.push(`/`);
          //   self.logged = false;
          return res.json();
        })
        // .then((json) => {
        //   app.toast(json.komunikat);
        // })
        .catch((error) => {
          console.log(error);
        });
      await store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
  },
};
</script>

<style>
/* .navbar {
  height: 46px;
  position: relative;
  background: #fff;
  box-shadow: 0 3px 8px rgba(0, 21, 41, 0.15);
  background-color: #fafafa;
}
.navbar .hamburger-container {
  line-height: 46px;
  height: 46px;
  width: 46px;
  float: left;
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;
}
.navbar .hambueger-container:hover {
  background: rgba(0, 0, 0, 0.025);
}
.navbar .breadcrumb-container {
  float: left;
}
.navbar .logout-button-container {
  float: right;
  height: 100%;
  line-height: 46px;
}

.navbar .usermenu-container {
  float: right;
  line-height: 46px;
  height: 100%;
  padding-right: 3em;
} */
</style>
