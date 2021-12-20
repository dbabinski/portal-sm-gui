<template>
  <!-- <section class="app-main"> -->
      <v-container app>  
        <router-view :key="key" />
      </v-container>
  <!-- </section> -->
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

<style>
/* .app-main {

  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
} */
</style>
