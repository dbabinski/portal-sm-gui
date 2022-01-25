<template>
      <v-container app>  
        <router-view :key="key" />
      </v-container>
</template>

<script>
export default {
  name: 'AppMainUser',
  computed: {
      key() {
          return this.$route.path
      }
  }
}
</script>

<style>
</style>
