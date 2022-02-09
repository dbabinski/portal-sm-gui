<template>
  <v-app id="inspire" class="app-wrapper">
    <v-app-bar app color="white" flat>
      <app-bar-user></app-bar-user>
    </v-app-bar>
    <v-main class="grey lighten-3">
      <v-container>
        <v-row>
          <v-col cols="2" class="pl-12 ml-12">
            <v-sheet rounded="lg">
              <v-list color="transparent">
                <sidebar-menu v-show="this.logged" />
                <div v-show="!this.logged" class="p-2 mx-6">
                  <v-btn text x-small plain class="text-subtitle-1 font-weight-medium" to="/login" >Zaloguj się </v-btn>
                  <span class="text-subtitle-1 font-weight-regular">aby uzyskać dostęp do konta</span>
                </div>
                <v-divider class="my-2"></v-divider>

                <v-list-item link color="grey lighten-4">
                  <v-list-item-content>
                    <v-list-item-title class="text-small"> Copyright@2022 </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>
          <v-col>
            <v-sheet min-height="70vh" rounded="lg">
              <app-main-user></app-main-user>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import store from "@/store/index";

export default {
  data() {
    return {
      logged: false,
    };
  },

  components: {
    SidebarMenu: () => import("./components/SideMenu/index.vue"),
    AppMainUser: () => import("./components/AppMainUser.vue"),
    AppBarUser: () => import("./components/AppBarUser.vue"),
  },
  created() {
    this.isLogged();
  },

  computed: {},

  methods: {
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
  },
};
</script>

<style></style>
