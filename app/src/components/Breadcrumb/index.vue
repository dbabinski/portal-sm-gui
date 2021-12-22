<template>
  <v-breadcrumbs class="app-breadcrumb">
    <v-breadcrumbs-item v-for="item in levelList" :key="item.path">
      <a class="app-breadcrumb">{{ item.meta.title }}</a>
    </v-breadcrumbs-item>
  </v-breadcrumbs>
</template>

<script>

export default {
  data() {
    return {
      levelList: null,
    };
  },
  watch: {
    $route(route) {
      if (route.path.startsWith("/redirect/")) {
        return;
      }
      this.getBreadcrumb();
    },
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(
        (item) => item.meta && item.meta.title
      );

      this.levelList = matched.filter(
        (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
      );
    },
  },
};
</script>

<style scoped>
.app-breadcrumb {
  font-size: 14px;
  line-height: 50px;
  margin-left: 0px;
  color: #97a8be;
  cursor: text;
}
</style>
