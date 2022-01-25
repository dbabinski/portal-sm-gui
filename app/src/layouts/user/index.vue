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
                <sidebar-menu />
                <v-divider class="my-2"></v-divider>

                <v-list-item link color="grey lighten-4">
                  <v-list-item-content>
                    <v-list-item-title> Refresh </v-list-item-title>
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
export default {
  data() {
    return {};
  },

  components: {
    SidebarMenu: () => import("./components/SideMenu/index.vue"),
    AppMainUser: () => import("./components/AppMainUser.vue"),
    AppBarUser: () => import("./components/AppBarUser.vue"),
  },

  computed: {},

  methods: {},
};
</script>

<style></style>
