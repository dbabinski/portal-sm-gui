<template>
  <v-container class="py-0 fill-height">
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
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

    <user-menu class="ml-5 mr-2" color="grey darken-1" size="32"></user-menu>
    <user-name class="mx-1" />
    <v-divider vertical inset></v-divider>

    <v-btn text class="mx-1" @click.native="logout">Wyloguj</v-btn>
  </v-container>
</template>

<script>
import router from "@/router/index";
import store from "@/store/index";

export default {
  name: "AppBarUser",
  components: {
    MenuItem: () => import("./Menu/index.vue"),
    UserMenu: () => import("@/components/UserMenu"),
    UserName: () => import("@/components/UserName"),
  },

  data() {
    return {
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
          path: "/user",
        },
        {
          index: 3,
          title: "Test",
          path: "/shop",
        },
        
      ],
    };
  },

  computed: {
    routes() {
      return this.$router.options.routes;
    },
  },

  methods: {
    async logout() {
      fetch("/sm-portal-server/autentykacja/logout")
        .then((res) => {
          router.push(`/login?redirect=${this.$route.fullPath}`);
          return res.json();
        })
        .catch((error) => {
          console.log(error);
        });
      await store.dispatch("logout");
    },
  },
};
</script>
