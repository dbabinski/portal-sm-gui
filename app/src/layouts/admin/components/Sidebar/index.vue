<template>
  <v-navigation-drawer rounded="false" color="#007bb4" app :value="isCollapse">
    <h2 class="menu-title">Menu</h2>
    <v-divider></v-divider>
    <v-list class="inside-list"  nav dense>
      <div v-for="(item, index) in items" :key="index">
        <sidebar-item class="list-items" :data="item" />
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Sidebar",
  components: {
    SidebarItem: () => import("./SidebarItem.vue")
  },
  data() {
    return {
      drawer: true,
      items: [
        { index: 0, title: "Panel Administratora", path: "/admin/dashboard", icon: 'fas fa-columns' },
        { index: 1, title: "Użytkownicy", path: "/admin/users", icon: 'fas fa-user' },
        { index: 2, title: "Klienci", path: "/admin/clients", icon: 'fas fa-users' },
        { index: 3, title: "Dokumentacja", path: "/admin/documentation", icon: 'fas fa-book' },
      ],
    };
  },
  computed: {
    ...mapGetters(["sidebar"]),

    isCollapse() {
      return !this.sidebar.opened;
    },

    routes() {
      return this.$router.options.routes;
    },
  },
  methods: {},
};
</script>
<style>
.list-items {
  border-bottom: 1px solid #094b5f;
  margin-top: 3px;
  margin-left: 0;
  margin-right: 0; 
  color: #0090d3;
}
.inside-list{
  margin: 0;
  padding-left: 0;
}
.menu-title {
  padding: 0.3em;
  text-align: left;
  margin-left: 15px;
  color: #ffffff;
}
</style>
