<template>
  <v-app>
    <h1>Layout Dash - Klient</h1>
    <v-card-text>
      <v-btn @click.native="logout">Wyloguj</v-btn>
    </v-card-text>
    <v-card>Panel Klienta</v-card>
  </v-app>
</template>

<script>
import router from "@/router/index";
import store from "@/store/index";

export default {
  data() {
    return {
    }
  },

  computed: {

  },

  methods: {


    async logout() {
      //   const self = this;
      fetch("/sm-portal-server/autentykacja/logout")
        .then((res) => {
          router.push(`/login?redirect=${this.$route.fullPath}`);
          //   self.logged = false;
          return res.json();
        })
        // .then((json) => {
        //   app.toast(json.komunikat);
        // })
        .catch((error) => {
          console.log(error);
        });
      await store.dispatch("logout");
    },
  },
};
</script>

<style></style>
