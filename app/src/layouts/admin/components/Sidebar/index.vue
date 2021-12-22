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
    SidebarItem: () => import("./SidebarItem.vue"),
  },
  data() {
    return {
      drawer: true,
      items: [
        { index: 0, title: "Panel Administratora", path: "/admin/dashboard", icon: 'fas fa-columns' },
        { index: 1, title: "Użytkownicy", path: "/admin/users", icon: 'fas fa-users' },
        { index: 2, title: "Dokumentacja", path: "/admin/documentation", icon: 'fas fa-book' },
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
  border-bottom: 2px solid #08617c;
  color: #5acdf0;
  color: #007bb4;
  margin: 1px; 
}
.inside-list{
  margin: 0;
  padding: 0;
}
.menu-title {
  text-align: left;
  left: o;
  margin-left: 15px;
  color: #ffffff;
}
</style>
