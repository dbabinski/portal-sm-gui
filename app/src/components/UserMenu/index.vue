<template>
<div>
  <v-menu
    bottom
    offset-y


  >
    <template v-slot:activator="{ on: menu, attrs }">
      <v-avatar 
        color="primary"
        size="40"
        v-bind="attrs"
        v-on="{...menu}"
        
      >
      <span class="white--text">{{initials}}</span>
      </v-avatar>
    </template>
    <v-list>
      <v-list-item
        link
      >
        <v-list-item-title v-model="user.email"><p>{{ user.email }}</p></v-list-item-title>
      </v-list-item>
      <v-divider/>
      <v-list-item
        divided @click.native="logout"
        class="logoutButton"
      >
            <v-list-item-title style="color:white">Wyloguj</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

<!-- 

    <p>{{user.email}}</p>
    <v-avatar 
        color="primary"
        size="40"
    >
    <span class="white--text">{{user.initials}}</span>
    </v-avatar>
     -->
</div>
</template>

<script>
import store from "@/store/index";
import router from "@/router/index";

export default {
  name: "UserMenu",
  data() {
    return {
      user: {
        fullName: "John Doe",
        email: store.getters.email
      },
    };
  },
  computed: {
    initials(){
      let mail = store.getters.email;
      let init = mail.substring(0,1).toUpperCase();
      return init
    }
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
      await store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
  }
};
</script>

<style scoped>
.logoutButton {
  background-color: #0078e9;
  cursor: pointer;
}
.logoutButton:hover {
  background-color: #0061bd;
}
</style>
