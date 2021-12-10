<template>
  <section class="app-main">
        <router-view :key="key" />
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
      key() {
          return this.$route.path
      }
  }
}
</script>

<style scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 84px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>
