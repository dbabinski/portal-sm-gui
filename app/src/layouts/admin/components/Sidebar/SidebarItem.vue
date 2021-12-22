<template>
  <v-list-item  :to="{ path: data.path }">
    <v-list-item-icon class="item-icons">
      <v-icon color="#ffffff">{{ data.icon }}</v-icon>
    </v-list-item-icon>
    <v-list-item-content >
      <v-list-item-title class="item-title">{{ data.title }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: "SidebarItem",
  props: {
    data: Object,
  },
  data() {
    return {};
  },
  computed: {
    getPath() {
      return this.data.path;
    },
  },
  methods: {},
};
</script>
<style >
.item-title {
  text-align: left;
  color: #ffffff;
}
.item-icons {
  justify-content: center;
  min-width: 44px;
}

</style>
