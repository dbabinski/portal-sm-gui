<template>
      <v-container app>  
        <router-view :key="key" />
      </v-container>
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
</style>
