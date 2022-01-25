<template>
  <v-app-bar dense class="navbar" app>
    <v-app-bar-nav-icon
      class="hamburger-container"
      :is-active="sidebar.opened"
      @click="toggleSidebar"
    />
    <v-btn text outlined class="ml-1">Strona Główna</v-btn>
    <v-divider vertical inset class="ml-6" ></v-divider>
    <breadcrumb class="breadcrumb-container" />
    <v-spacer></v-spacer>
    <user-menu class="usermenu-container" />
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
    UserMenu: () => import("@/components/UserMenu"),
  },
  data() {
    return {};
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
</style>
