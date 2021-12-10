<template>
  <div>
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    <breadcrumb />

    <v-btn @click.native="logout">Wyloguj</v-btn>
  </div>
</template>

<script>
import router from "@/router/index";
import store from "@/store/index";

export default {
  name: "Navbar",
  components: {
    Breadcrumb: () => import("@/components/Breadcrumb"),
  },
  data() {
    return {
      drawer: null,
    };
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

<style scoped>
</style>
