<template>
  <v-list-item :to="{ path: data.path }">
    <!-- <v-list-item-icon class="item-icons">
      <v-icon color="#000000">{{ data.icon }}</v-icon>
    </v-list-item-icon> -->
    <v-list-item-content >
      <v-list-item-title class="item-title text-center">{{ data.title }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: "SidebarmenuItem",
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
.item-title{
    color: #000000;
}
</style>
