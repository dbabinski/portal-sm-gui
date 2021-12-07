<template>
  <v-app>
    <h1>Testowy</h1>
    <v-card>
      <v-btn dark title @click.native="logout">logout from test </v-btn>
    </v-card>
    <v-card>
      <router-link to="/">Go to main Page</router-link>
    </v-card>
    <v-card>
        <h2>Panel Testowy Klienta</h2>
    </v-card>
  </v-app>
</template>

<script>
import router from "@/router/index";
import store from "@/store/index";

export default {
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
