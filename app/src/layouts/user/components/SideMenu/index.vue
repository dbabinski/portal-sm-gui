<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <div v-for="(item, index) in items" :key="index">
          <sidebarmenu-item :data="item" />
        </div>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>      

<script>
export default {
  
  components: {
    SidebarmenuItem: () => import("./SidemenuItem.vue"),
  },
  data() {
    return {
        items: [
        {
          index: 0,
          title: "Panel klienta",
          path: "/",
          icon: "fas fa-columns",
        },
        {
          index: 1,
          title: "Aktualności",
          path: "/articles",
          icon: "fas fa-user",
        },]
    };
  },
};
</script>

<style>

</style>

