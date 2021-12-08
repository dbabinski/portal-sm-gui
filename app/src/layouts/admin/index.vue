<template>
  <v-app>
    <h1>Layout Dash</h1>
    <h2>Administrator</h2>
    <v-card-text>
            <v-btn @click.native="logout">Wyloguj</v-btn>

    </v-card-text>
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
      await store.dispatch("logout");
    },
  },
};
</script>

<style></style>
