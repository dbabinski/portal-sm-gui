<template>
  <v-app id="inspire">
    <v-navigation-drawer app>
    </v-navigation-drawer>
    <navbar />
    <v-main>
      <app-main />
    </v-main>
  </v-app>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  name: "LayoutAdmin",
  components: {
    AppMain: () => import("./components/AppMain.vue"),
    Navbar

  },
  data() {
    return {

    };
  },

}
</script>