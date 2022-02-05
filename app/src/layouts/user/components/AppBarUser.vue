<template>
  <v-container class="py-0 fill-height">
    <v-btn v-show="this.admin" outlined class="ml-12 mr-0" to="/admin" >Panel Administratora</v-btn>
    <v-spacer class="mx-0 px-0" v-show="this.admin"></v-spacer>
    <v-spacer v-show="!this.admin"></v-spacer>
    <div v-for="(item, index) in items" :key="index">
      <menu-item :data="item" />
    </div>
    <v-spacer></v-spacer>

    <v-responsive max-width="260">
      <v-text-field
        dense
        flat
        hide-details
        rounded
        solo-inverted
        label="Wyszukaj..."
      ></v-text-field>
    </v-responsive>

    <user-menu
      v-show="this.logged"
      class="ml-5 mr-2"
      color="grey darken-1"
      size="32"
    ></user-menu>
    <user-name v-show="this.logged" class="mx-1" />

    <v-divider vertical inset class="mx-2"></v-divider>

    <v-btn text class="mx-1" @click.native="logout">{{ this.label }}</v-btn>
  </v-container>
</template>

<script>
import router from "@/router/index";
import store from "@/store/index";
// import { getJSON } from "@/lib/cookies";
// import isNull from "@/lib/utils.js";

export default {
  name: "AppBarUser",
  components: {
    MenuItem: () => import("./Menu/index.vue"),
    UserMenu: () => import("@/components/UserMenu"),
    UserName: () => import("@/components/UserName"),
  },

  data() {
    return {
      label: "test",
      logged: false,
      admin: false,
      items: [
        {
          index: 0,
          title: "Strona główna",
          path: "/",
        },
        {
          index: 1,
          title: "Aktualności",
          path: "/articles",
        },
        {
          index: 2,
          title: "Panel Klienta",
          path: "/dashboard-user",
        },
        {
          index: 3,
          title: "Test",
          path: "/shop",
        },
      ],
    };
  },
  created() {
    this.isLogged();
    this.loggin();
    this.isAdmin();
  },
  computed: {
    routes() {
      return this.$router.options.routes;
    },
  },

  methods: {
    loggin() {
      let logged = this.isLogged();
      if (logged) {
        this.label = "Wyloguj";
      } else {
        this.label = "Zaloguj";
      }
    },

    isLogged() {
      let s = store.getters.isLogged;
      if (s === null || s === undefined || s === "" || s === false) {
        this.logged = false;
        return false;
      } else {
        this.logged = true;
        return true;
      }
    },
    isAdmin(){
      let s = store.getters.scope;
      if (s === null || s === undefined || s === "" || s === false) {
        this.admin = false;
        console.log("admin: " + s);
        return false;
      } else {
        if ( s === 19 ) {
        this.admin = true;
        console.log("admin: " + s);
        return true;
        } 
        else {
          this.admin = false;
          return false;
        }
      }
    },
    async logout() {
      fetch("/sm-portal-server/autentykacja/logout")
        .then((res) => {
          router.push(`/login?redirect=${this.$route.fullPath}`);
          // router.go();
          return res.json();
        })
        .catch((error) => {
          console.log(error);
        });
      await store.dispatch("user/logout");
    },
  },
};
</script>
